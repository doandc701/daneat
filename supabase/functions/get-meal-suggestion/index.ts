import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const mockMeals = [
      {
        meal_name: "Phở Gà Lá Chanh",
        reasoning: "Món ăn nhẹ nhàng, ấm bụng và rất giàu dinh dưỡng cho buổi sáng.",
        ingredients: ["Bánh phở", "Thịt gà", "Lá chanh", "Hành tây", "Nước dùng xương"],
        steps: [
          "Luộc gà chín tới và xé phay.",
          "Trần bánh phở qua nước sôi.",
          "Xếp gà, lá chanh thái chỉ và hành lên bát.",
          "Chan nước dùng nóng hổi và thưởng thức."
        ]
      },
      {
        meal_name: "Cơm Tấm Sườn Bì Chả",
        reasoning: "Cung cấp năng lượng dồi dào cho một ngày làm việc năng suất.",
        ingredients: ["Gạo tấm", "Sườn nướng", "Thịt bì", "Chả trứng", "Nước mắm chua ngọt"],
        steps: [
          "Nấu cơm tấm chín mềm.",
          "Nướng sườn với gia vị đậm đà.",
          "Làm chả trứng và trộn bì.",
          "Trình bày ra đĩa cùng đồ chua và mỡ hành."
        ]
      },
      {
        meal_name: "Salad Ức Gà Áp Chảo",
        reasoning: "Lựa chọn tuyệt vời cho người đang theo chế độ ăn healthy, ít tinh bột.",
        ingredients: ["Ức gà", "Xà lách", "Cà chua bi", "Dầu olive", "Sốt mè rang"],
        steps: [
          "Ức gà ướp muối tiêu và áp chảo vàng đều.",
          "Rửa sạch rau củ và thái vừa ăn.",
          "Trộn đều gà và rau với sốt mè rang.",
          "Rắc thêm ít hạt mè hoặc các loại hạt để tăng hương vị."
        ]
      }
    ];

    const randomMeal = mockMeals[Math.floor(Math.random() * mockMeals.length)];

    return new Response(
      JSON.stringify(randomMeal),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    )
  }
})
