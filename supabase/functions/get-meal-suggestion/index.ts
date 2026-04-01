// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ── 1. Init Supabase Admin Client ────────────────────────────────────
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // ── 2. Get user context (profile + blacklist) ────────────────────────
    // Extract JWT to identify the user (may be anonymous/anon)
    const authHeader = req.headers.get('Authorization') ?? ''
    let userProfile: any = null
    let blacklistItems: string[] = []

    if (authHeader.startsWith('Bearer ')) {
      try {
        const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
        
        if (user) {
          // Fetch profile
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('user_type, budget, allergies, dislikes, cooking_experience')
            .eq('id', user.id)
            .single()
          
          userProfile = profile

          // Fetch blacklist
          const { data: blacklist } = await supabaseAdmin
            .from('blacklist')
            .select('item_name')
            .eq('user_id', user.id)

          blacklistItems = blacklist?.map((b: any) => b.item_name) ?? []
        }
      } catch (_) {
        // Anonymous user — proceed without profile
      }
    }

    // ── 3. Build Context strings for the AI prompt ───────────────────────
    const now = new Date()
    const hour = now.getHours()
    const meal = hour < 10 ? 'bữa sáng' : hour < 14 ? 'bữa trưa' : hour < 18 ? 'bữa xế' : 'bữa tối'
    const dayOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][now.getDay()]

    const profileContext = userProfile ? `
- Đối tượng người dùng: ${userProfile.user_type === 'student' ? 'Sinh viên (ưu tiên rẻ, nhanh)' : userProfile.user_type === 'family' ? 'Gia đình (khẩu phần lớn)' : 'Người đi làm (tiện lợi, healthy)'}
- Ngân sách: ${userProfile.budget === 'low' ? 'Thấp (dưới 50k/bữa)' : userProfile.budget === 'medium' ? 'Trung bình (50-150k/bữa)' : 'Cao (trên 150k/bữa)'}
- Kinh nghiệm nấu: ${userProfile.cooking_experience ?? 'Intermediate'}
- Dị ứng/kiêng ăn: ${userProfile.allergies?.join(', ') || 'Không có'}
- Không thích: ${userProfile.dislikes?.join(', ') || 'Không có'}` : '- Người dùng chưa cài đặt profile (gợi ý món ăn Việt Nam phổ thông)'

    const blacklistContext = blacklistItems.length > 0
      ? `\n- TUYỆT ĐỐI KHÔNG sử dụng các nguyên liệu/món này: ${blacklistItems.join(', ')}`
      : ''

    // ── 4. Call Gemini API ────────────────────────────────────────────────
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      // Fallback to mock if no API key set
      throw new Error('GEMINI_API_KEY not configured')
    }

    const prompt = `Bạn là một AI ẩm thực chuyên nghiệp tên là SmartEat. Nhiệm vụ của bạn là gợi ý một món ăn Việt Nam phù hợp và thực tế.

Thời gian hiện tại: ${dayOfWeek}, ${meal} (${hour}:00)

Thông tin người dùng:
${profileContext}${blacklistContext}

YÊU CẦU:
- Gợi ý MỘT món ăn Việt Nam duy nhất, phù hợp với thời điểm và profile trên
- Món ăn phải phổ biến, thực tế, có thể nấu hoặc mua được ở Việt Nam
- KHÔNG gợi ý bất kỳ nguyên liệu nào trong danh sách blacklist

ĐỊNH DẠNG TRẢ LỜI (JSON thuần, không có markdown):
{
  "meal_name": "Tên món ăn",
  "reasoning": "Lý do ngắn gọn (1-2 câu) tại sao món này phù hợp ngay lúc này",
  "ingredients": ["nguyên liệu 1", "nguyên liệu 2", "nguyên liệu 3", "nguyên liệu 4", "nguyên liệu 5"],
  "steps": ["Bước 1...", "Bước 2...", "Bước 3...", "Bước 4..."]
}`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      throw new Error(`Gemini API error: ${geminiRes.status} — ${errText}`)
    }

    const geminiData = await geminiRes.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // ── 5. Parse JSON from Gemini response ───────────────────────────────
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Gemini did not return valid JSON')
    
    const meal_data = JSON.parse(jsonMatch[0])

    // Validate structure
    if (!meal_data.meal_name || !meal_data.ingredients || !meal_data.steps) {
      throw new Error('Invalid meal structure from Gemini')
    }

    return new Response(
      JSON.stringify(meal_data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Edge function error:', error.message)
    
    // ── Fallback: Return mock data if Gemini fails ────────────────────────
    const fallbacks = [
      {
        meal_name: "Bún Bò Huế",
        reasoning: "Món ăn đậm đà, ấm bụng — lý tưởng cho buổi hiện tại của bạn.",
        ingredients: ["Bún tươi", "Thịt bò", "Chả lụa", "Sả", "Mắm ruốc", "Ớt"],
        steps: ["Ninh xương bò lấy nước dùng trong 2 tiếng.", "Xào sả và mắm ruốc cho thơm.", "Cho gia vị vào nước dùng, nêm vừa ăn.", "Trần bún, xếp thịt và chan nước dùng nóng hổi."]
      },
      {
        meal_name: "Cơm Gà Hội An",
        reasoning: "Món ăn Việt Nam trứ danh, cân bằng dinh dưỡng, phù hợp mọi lứa tuổi.",
        ingredients: ["Cơm trắng", "Thịt gà ta", "Hành phi", "Rau răm", "Nước mắm gừng"],
        steps: ["Luộc gà chín vàng với hành và gừng.", "Nấu cơm bằng nước luộc gà cho thơm.", "Xé gà, trộn với hành phi và rau răm.", "Chuẩn bị nước chấm gừng và thưởng thức."]
      },
      {
        meal_name: "Bánh Mì Thịt Nướng",
        reasoning: "Nhanh, tiện lợi và ngon — lựa chọn hoàn hảo cho bữa ăn bận rộn.",
        ingredients: ["Bánh mì giòn", "Thịt heo nướng", "Pate", "Rau thơm", "Dưa leo", "Ớt"],
        steps: ["Nướng thịt heo với gia vị đặc trưng đến vàng đều.", "Nướng bánh mì cho giòn vỏ.", "Phết pate lên bánh, xếp thịt và rau vào.", "Thêm ớt và dưa leo, ăn ngay khi còn nóng."]
      },
    ]

    const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)]

    return new Response(
      JSON.stringify(fallback),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
