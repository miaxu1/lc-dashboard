import { useState, useMemo } from "react";
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

const ages = [0,1,4,7,10,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58,61,64,67,70,73,76,79,82,85,88,91,94,97,100,103,106,109,112,115,118,121,124,127];

const ERA_DEFS = [
  {label:"2015Q4\u20132018Q3", color:"#a8a8a8", start:"2015Q4", end:"2018Q3"},
  {label:"2018Q4\u20132019Q3", color:"#6baed6", start:"2018Q4", end:"2019Q3"},
  {label:"2019Q4\u20132020Q3", color:"#74c476", start:"2019Q4", end:"2020Q3"},
  {label:"2020Q4\u20132021Q3", color:"#fd8d3c", start:"2020Q4", end:"2021Q3"},
  {label:"2021Q4\u20132022Q3", color:"#e24b4a", start:"2021Q4", end:"2022Q3"},
  {label:"2022Q4\u20132023Q3", color:"#f4c542", start:"2022Q4", end:"2023Q3"},
  {label:"2023Q4\u20132024Q3", color:"#a78bfa", start:"2023Q4", end:"2024Q3"},
  {label:"2024Q4\u20132025Q3", color:"#38bdf8", start:"2024Q4", end:"2025Q3"},
  {label:"2025Q4\u20132026Q3", color:"#f472b6", start:"2025Q4", end:"2026Q3"},
];
function aqToNum(aq){return parseInt(aq.slice(0,4))*10+parseInt(aq.slice(5,6));}
function getEra(aq){const n=aqToNum(aq);for(const e of ERA_DEFS)if(n>=aqToNum(e.start)&&n<=aqToNum(e.end))return e.label;return ERA_DEFS[ERA_DEFS.length-1].label;}
function getColor(aq){return ERA_DEFS.find(e=>e.label===getEra(aq))?.color??"#a8a8a8";}
const ERAS=ERA_DEFS.map(e=>e.label);
const ERA_COLORS=Object.fromEntries(ERA_DEFS.map(e=>[e.label,e.color]));

function buildLineData(raw){
  return raw.map(r=>{
    const points=[];
    r.pts.forEach((v,i)=>{if(v!==null)points.push({age:ages[i],lc:v});});
    const last=points[points.length-1];
    return {...r,points,lastAge:last?.age??0,lastLC:last?.lc??0,color:getColor(r.aq),era:getEra(r.aq)};
  });
}

const APD_DATA = [
  {aq:'2015Q4',pts:[0.0, 2.3709, 8.6967, 8.0526, 7.2861, 7.0027, 6.9136, 6.9574, 6.7506, 6.7505, 6.7157, 6.7506, 6.7013, 6.7205, 6.6718, 6.6365, 6.6365, 6.6365, 6.6365, 6.6364, 6.6855, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365, 6.6365],implied:6.6365,defaultLC:6.6365,priorLC:6.6365},
  {aq:'2016Q1',pts:[0.0, 1.5725, 7.6899, 7.9013, 7.2296, 6.6885, 6.4216, 6.4595, 6.4442, 6.3595, 6.3621, 6.28, 6.1532, 6.0717, 6.0287, 6.0053, 5.9826, 5.9911, 6.0016, 6.011, 6.0111, 6.0017, 6.0017, 6.0017, 6.0017, 6.0017, 6.0017, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016, 6.0016],implied:6.0016,defaultLC:6.0016,priorLC:null},
  {aq:'2016Q2',pts:[0.0, 1.4501, 7.9118, 7.8653, 6.7282, 6.6916, 6.5994, 6.6111, 6.5105, 6.4502, 6.4198, 6.3452, 6.3139, 6.3076, 6.2788, 6.289, 6.2941, 6.2941, 6.2945, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254, 6.3254],implied:6.3254,defaultLC:null,priorLC:null},
  {aq:'2016Q3',pts:[0.0, 1.7411, 9.7643, 7.6673, 7.408, 7.3149, 7.3631, 7.3131, 7.3678, 7.3762, 7.2991, 7.2579, 7.2271, 7.2433, 7.314, 7.3022, 7.3172, 7.2601, 7.2602, 7.2495, 7.2244, 7.2245, 7.2327, 7.2327, 7.2327, 7.2327, 7.29, 7.29, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913, 7.2913],implied:null,defaultLC:null,priorLC:null},
  {aq:'2016Q4',pts:[0.0, 2.6446, 6.9478, 7.4256, 7.5082, 7.7027, 7.6488, 7.6092, 7.619, 7.5967, 7.6392, 7.6231, 7.6107, 7.6052, 7.5894, 7.5921, 7.5923, 7.5707, 7.5707, 7.5817, 7.5594, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, 7.5579, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q1',pts:[0.0, 0.9907, 6.2904, 6.5334, 6.4766, 6.7665, 6.8504, 6.9089, 6.9651, 6.9624, 6.8298, 6.8392, 6.8572, 6.8378, 6.869, 6.8463, 6.8379, 6.84, 6.8402, 6.8401, 6.8438, 6.8453, 6.8857, 6.8857, 6.8857, 6.8857, 6.8857, 6.8857, 6.885, 6.8848, 6.8844, 6.8838, 6.8838, 6.8838, 6.8838, 6.8838, 6.8838, 6.8838, 6.8838, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q2',pts:[0.0, 0.6416, 5.9984, 7.2911, 7.4774, 7.386, 7.2174, 7.2511, 7.3963, 7.2614, 7.2069, 7.2214, 7.1621, 7.1582, 7.1587, 7.1587, 7.1623, 7.1707, 7.1735, 7.1729, 7.1725, 7.184, 7.184, 7.1799, 7.1796, 7.1795, 7.1795, 7.1795, 7.1795, 7.179, 7.1698, 7.1698, 7.1698, 7.1698, 7.1698, 7.1698, 7.1698, 7.1698, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q3',pts:[0.0, 0.7032, 5.7833, 7.5086, 7.3904, 7.3241, 7.2167, 7.2393, 7.1565, 7.1592, 7.1683, 7.1586, 7.148, 7.1809, 7.1705, 7.175, 7.1635, 7.1592, 7.1589, 7.1561, 7.1562, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, 7.1561, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q4',pts:[0.0, 0.7997, 6.7798, 8.1257, 7.8664, 7.6299, 7.5964, 7.5651, 7.5902, 7.6608, 7.6471, 7.6531, 7.6619, 7.6455, 7.6598, 7.6828, 7.6847, 7.6965, 7.6977, 7.6971, 7.6963, 7.6962, 7.6961, 7.6884, 7.6875, 7.6764, 7.6758, 7.6766, 7.6727, 7.6722, 7.6715, 7.6707, 7.6699, 7.6692, 7.6691, 7.6688, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q1',pts:[0.0, 1.0298, 7.7203, 8.7108, 8.2756, 8.0753, 7.8565, 7.8313, 7.8804, 7.9051, 7.9069, 7.9033, 7.9194, 7.9316, 7.9522, 7.9444, 7.9497, 7.9422, 7.9421, 7.9421, 7.9397, 7.928, 7.9283, 7.929, 7.9181, 7.9181, 7.9093, 7.9063, 7.9055, 7.8999, 7.8993, 7.8988, 7.8983, 7.8981, 7.8981, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q2',pts:[0.0, 1.2656, 8.7637, 9.4862, 8.8078, 8.7523, 8.6147, 8.586, 8.5697, 8.5878, 8.5963, 8.6215, 8.6152, 8.6071, 8.6291, 8.6381, 8.6358, 8.6369, 8.6379, 8.6384, 8.6387, 8.6388, 8.6489, 8.6399, 8.6402, 8.6404, 8.6355, 8.6306, 8.6305, 8.6283, 8.6282, 8.6281, 8.6279, 8.6277, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q3',pts:[0.0, 1.5367, 9.2378, 9.5699, 9.0966, 8.9275, 8.9246, 8.8348, 8.884, 8.8203, 8.8134, 8.8522, 8.8409, 8.834, 8.8185, 8.8259, 8.8228, 8.8288, 8.8297, 8.824, 8.8217, 8.8215, 8.8081, 8.8099, 8.8035, 8.8015, 8.7993, 8.7954, 8.7959, 8.7948, 8.7947, 8.7923, 8.7923, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q4',pts:[0.0, 2.1367, 10.6006, 11.2884, 11.0064, 10.7947, 10.6733, 10.5918, 10.499, 10.4814, 10.4599, 10.4326, 10.4008, 10.4239, 10.4011, 10.4066, 10.4065, 10.4044, 10.4043, 10.4037, 10.4036, 10.4033, 10.4031, 10.403, 10.4027, 10.4026, 10.4025, 10.4023, 10.4021, 10.4019, 10.4015, 10.4013, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.4001,defaultLC:10.4001,priorLC:10.4001},
  {aq:'2019Q1',pts:[0.0, 1.5493, 10.6954, 9.5698, 8.8569, 8.4258, 8.195, 8.0859, 8.1124, 8.0604, 8.0421, 8.0113, 8.0699, 8.1244, 8.2161, 8.2291, 8.2257, 8.2709, 8.2685, 8.2685, 8.061, 8.0616, 8.0616, 8.0612, 8.061, 8.061, 8.061, 8.061, 8.061, 8.0611, 8.0611, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:8.0599,defaultLC:8.0599,priorLC:8.0599},
  {aq:'2019Q2',pts:[0.0, 1.5206, 11.0482, 8.9584, 8.1875, 7.7857, 7.5991, 7.5358, 7.4679, 7.4241, 7.4079, 7.3833, 7.389, 7.3956, 7.4001, 7.3824, 7.3893, 7.39, 7.3789, 7.376, 7.3763, 7.3756, 7.3751, 7.3747, 7.3739, 7.3719, 7.3715, 7.3714, 7.3705, 7.3721, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:7.3697,defaultLC:7.3697,priorLC:7.3683},
  {aq:'2019Q3',pts:[0.0, 1.7568, 11.0043, 8.8572, 8.0108, 7.6744, 7.4408, 7.3543, 7.2942, 7.2631, 7.21, 7.1935, 7.1807, 7.1826, 7.1928, 7.1869, 7.1773, 7.1756, 7.1777, 7.1766, 7.1786, 7.1849, 7.1831, 7.183, 7.1819, 7.1804, 7.1804, 7.1808, 7.1804, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:7.1751,defaultLC:7.1751,priorLC:7.1751},
  {aq:'2019Q4',pts:[0.0, 2.6168, 11.2537, 9.8613, 9.1125, 8.7505, 8.6497, 8.5741, 8.53, 8.4971, 8.4972, 8.4926, 8.4739, 8.5117, 8.4983, 8.4712, 8.472, 8.4682, 8.4691, 8.4748, 8.472, 8.4872, 8.4927, 8.4909, 8.5002, 8.5061, 8.5146, 8.5166, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:8.5011,defaultLC:8.5011,priorLC:8.4972},
  {aq:'2020Q1',pts:[0.0, 2.7491, 10.5275, 8.9269, 8.2362, 7.8737, 7.7977, 7.6803, 7.6461, 7.5901, 7.5634, 7.5932, 7.6337, 7.6624, 7.6474, 7.6391, 7.6498, 7.6541, 7.6566, 7.6567, 7.6541, 7.6546, 7.657, 7.6537, 7.6535, 7.6547, 7.6565, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:7.6536,defaultLC:7.6536,priorLC:7.6521},
  {aq:'2020Q2',pts:[0.0, 1.766, 9.6619, 7.9276, 7.3816, 7.1308, 6.9711, 6.804, 6.7392, 6.6748, 6.6392, 6.6559, 6.6426, 6.6335, 6.652, 6.6052, 6.6048, 6.6073, 6.6041, 6.6009, 6.5988, 6.6012, 6.6007, 6.6003, 6.5996, 6.5995, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:6.5964,defaultLC:6.5964,priorLC:6.5964},
  {aq:'2020Q3',pts:[0.0, 2.4135, 10.734, 9.0225, 8.0794, 7.7218, 7.6278, 7.4664, 7.3825, 7.345, 7.3617, 7.3082, 7.3136, 7.313, 7.3045, 7.304, 7.2921, 7.2822, 7.2819, 7.2819, 7.28, 7.2743, 7.2787, 7.2831, 7.2827, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:7.279,defaultLC:7.279,priorLC:7.279},
  {aq:'2020Q4',pts:[0.0, 2.8397, 12.3688, 10.8497, 10.0088, 9.5494, 9.2463, 9.1706, 9.0645, 9.0411, 9.0594, 8.9394, 8.9441, 8.9395, 8.9619, 8.9727, 8.9818, 8.9822, 8.9887, 8.9882, 8.9911, 8.9903, 8.9917, 9.0139, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.0076,defaultLC:9.0076,priorLC:8.9881},
  {aq:'2021Q1',pts:[0.0, 2.405, 11.4165, 10.4456, 9.781, 9.0661, 8.75, 8.5218, 8.4472, 8.3714, 8.2511, 8.2347, 8.2104, 8.2065, 8.2371, 8.2271, 8.2372, 8.2439, 8.2614, 8.2522, 8.2577, 8.2598, 8.2608, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:8.2581,defaultLC:8.2581,priorLC:8.2581},
  {aq:'2021Q2',pts:[0.0, 2.1075, 12.6545, 12.2062, 10.9324, 10.3284, 9.897, 9.7959, 9.7105, 9.5194, 9.4796, 9.5142, 9.4578, 9.4344, 9.4701, 9.4715, 9.4747, 9.4771, 9.4849, 9.5006, 9.5073, 9.515, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.513,defaultLC:9.513,priorLC:9.5067},
  {aq:'2021Q3',pts:[0.0, 2.3041, 13.3491, 12.8389, 11.5445, 10.9341, 10.4923, 10.3219, 10.108, 10.1446, 10.1322, 10.0747, 10.0716, 10.0785, 10.0973, 10.141, 10.1365, 10.1564, 10.1372, 10.1766, 10.2165, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.2178,defaultLC:10.2178,priorLC:10.1793},
  {aq:'2021Q4',pts:[0.0, 2.8774, 14.0368, 13.6619, 12.87, 12.055, 11.6721, 11.4606, 11.1784, 11.1057, 11.0379, 10.9936, 10.9735, 10.9496, 10.9503, 10.9351, 10.946, 10.9775, 11.0248, 11.0295, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.032,defaultLC:11.032,priorLC:11.0365},
  {aq:'2022Q1',pts:[0.0, 3.0176, 14.4458, 14.0387, 13.0216, 12.5195, 12.2764, 12.0914, 11.9762, 11.9001, 11.9231, 11.8858, 11.846, 11.8525, 11.8383, 11.846, 11.8671, 11.8732, 11.8843, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.8935,defaultLC:11.8935,priorLC:11.8998},
  {aq:'2022Q2',pts:[0.0, 2.6978, 13.6895, 13.0972, 12.0393, 11.4528, 11.1102, 10.9833, 10.9031, 10.8115, 10.7456, 10.7015, 10.6759, 10.6929, 10.6771, 10.7134, 10.7278, 10.7834, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.8087,defaultLC:10.8087,priorLC:10.7625},
  {aq:'2022Q3',pts:[0.0, 2.6854, 14.5895, 13.955, 13.1815, 12.5216, 12.3231, 12.1061, 11.946, 11.8599, 11.7865, 11.7798, 11.6975, 11.6938, 11.6955, 11.7144, 11.7285, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.7637,defaultLC:11.7637,priorLC:11.7588},
  {aq:'2022Q4',pts:[0.0, 2.6136, 15.0111, 14.7895, 13.9785, 13.2757, 13.0057, 12.8683, 12.8153, 12.7478, 12.7205, 12.7135, 12.6936, 12.6844, 12.6925, 12.7013, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.7492,defaultLC:12.7492,priorLC:12.7559},
  {aq:'2023Q1',pts:[0.0, 3.8803, 14.9696, 13.4389, 12.6436, 12.2379, 12.0301, 11.7917, 11.7144, 11.6617, 11.6393, 11.6222, 11.5688, 11.5404, 11.5417, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.5984,defaultLC:11.5984,priorLC:11.6017},
  {aq:'2023Q2',pts:[0.0, 3.5267, 12.9784, 11.7153, 10.6089, 10.3293, 10.0471, 10.011, 9.9325, 9.8909, 9.8969, 9.8999, 9.9085, 9.9177, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.9704,defaultLC:9.9704,priorLC:9.9567},
  {aq:'2023Q3',pts:[0.0, 4.1732, 13.3158, 12.689, 12.0856, 11.6489, 11.3086, 11.1185, 11.1046, 11.0406, 10.9973, 10.9602, 10.9426, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.0016,defaultLC:11.0016,priorLC:10.9822},
  {aq:'2023Q4',pts:[0.0, 4.7249, 15.3053, 14.7139, 13.7425, 13.1868, 13.0076, 12.8799, 12.7922, 12.7243, 12.6722, 12.6689, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.7111,defaultLC:12.7003,priorLC:12.684},
  {aq:'2024Q1',pts:[0.0, 3.2123, 13.7952, 12.8555, 11.7928, 11.3096, 11.1597, 11.0536, 10.9765, 11.015, 10.9952, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.9882,defaultLC:10.9882,priorLC:10.9827},
  {aq:'2024Q2',pts:[0.0, 3.9834, 14.224, 13.226, 12.2425, 11.6788, 11.417, 11.2787, 11.2172, 11.2, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.1721,defaultLC:11.1721,priorLC:11.1478},
  {aq:'2024Q3',pts:[0.0, 3.641, 14.6895, 12.9934, 11.9874, 11.4271, 11.138, 11.0196, 10.968, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.8894,defaultLC:10.8894,priorLC:10.9831},
  {aq:'2024Q4',pts:[0.0, 4.4652, 15.3867, 13.8357, 12.783, 12.3309, 12.2235, 12.1056, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.9556,defaultLC:11.9556,priorLC:11.9568},
  {aq:'2025Q1',pts:[0.0, 4.2748, 14.5067, 13.1097, 11.9181, 11.5748, 11.3577, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.1162,defaultLC:11.1162,priorLC:11.1155},
  {aq:'2025Q2',pts:[0.0, 3.9419, 13.0213, 11.7778, 10.9568, 10.5781, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.1707,defaultLC:10.1707,priorLC:10.1304},
  {aq:'2025Q3',pts:[0.0, 3.5421, 12.4473, 10.9282, 10.0155, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.3871,defaultLC:9.3366,priorLC:9.6945},
  {aq:'2025Q4',pts:[0.0, 4.1054, 13.6024, 12.5904, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.4848,defaultLC:11.0203,priorLC:12.0545},
  {aq:'2026Q1',pts:[0.0, 3.5514, 11.6563, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.9848,defaultLC:9.4791,priorLC:12.3904},
  {aq:'2026Q2',pts:[0.0, 3.6452, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:null,defaultLC:11.7469,priorLC:12.1611},
];
const DM_DATA = [
  {aq:'2015Q4',pts:[0.0, 0.1567, 0.3278, 0.3732, 0.617, 0.6623, 1.034, 1.0968, 2.1642, 3.7393, 3.4908, 4.0527, 3.6793, 3.6878, 3.7208, 3.786, 3.8409, 3.8409, 3.8409, 3.8409, 3.9916, 3.9916, 3.9916, 3.9916, 3.9709, 4.3914, 4.2102, 4.2102, 4.2102, 4.2102, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194, 4.194],implied:4.194,defaultLC:4.194,priorLC:4.194},
  {aq:'2016Q1',pts:[0.0, 0.051, 0.98, 1.1899, 1.5788, 1.5383, 1.5179, 1.6154, 1.6138, 1.9251, 1.975, 1.9752, 1.9779, 2.1265, 2.1243, 2.1579, 2.3654, 2.4391, 1.6667, 1.7259, 1.6554, 1.6554, 1.6554, 1.6554, 1.6554, 1.6554, 1.6554, 2.5006, 2.5055, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425, 2.4425],implied:2.4425,defaultLC:2.4425,priorLC:null},
  {aq:'2016Q2',pts:[0.0, 0.1865, 0.8504, 1.4956, 2.4494, 2.5893, 2.7913, 3.0803, 3.3477, 4.6781, 4.7622, 4.7616, 4.7717, 4.7233, 4.7173, 4.7207, 4.7207, 4.7529, 4.7289, 4.7289, 4.7289, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73, 4.73],implied:4.73,defaultLC:null,priorLC:null},
  {aq:'2016Q3',pts:[0.0, 0.2399, 1.9738, 2.6275, 3.3004, 4.0949, 5.3213, 5.3631, 5.9183, 6.1181, 6.3781, 6.4283, 6.7803, 6.7314, 6.4995, 6.7792, 6.9217, 7.3511, 7.3771, 7.3771, 7.517, 7.4475, 7.945, 7.9815, 7.9622, 8.2227, 6.8449, 6.8449, 6.8449, 6.8449, 6.7894, 6.7894, 6.7894, 6.7894, 6.7894, 6.7894, 6.7881, 6.7881, 6.7881, 6.7881, 6.7881],implied:null,defaultLC:null,priorLC:null},
  {aq:'2016Q4',pts:[0.0, 0.4538, 2.1478, 3.6121, 4.6308, 5.6121, 5.9626, 6.4705, 7.1342, 7.481, 7.8931, 8.4435, 8.5866, 8.9306, 9.7664, 10.0495, 10.5733, 10.8736, 10.8846, 11.0266, 11.1228, 11.0998, 11.0905, 11.0832, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, 11.0851, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q1',pts:[0.0, 0.3512, 1.6395, 3.7896, 5.6349, 6.0713, 7.4755, 7.6834, 8.3622, 8.5407, 8.9578, 8.6493, 9.4504, 10.3588, 11.1035, 21.0288, 21.629, 21.8298, 21.7022, 21.9215, 21.7034, 22.2576, 22.3981, 18.3765, 17.0093, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0083, 17.0122, 17.012, 17.012, 17.012, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q2',pts:[0.0, 0.1045, 1.9085, 4.4322, 5.5439, 6.3593, 7.3968, 8.021, 8.4524, 8.857, 9.4431, 10.7485, 11.1789, 11.4454, 11.2752, 11.58, 11.447, 11.6407, 11.653, 11.7021, 11.7218, 11.8548, 11.8681, 11.8681, 11.7995, 11.7995, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, 11.801, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q3',pts:[0.0, 0.0581, 1.83, 3.7657, 4.864, 5.6609, 5.9469, 6.1997, 6.4208, 6.9632, 7.7169, 8.8706, 9.6925, 9.7337, 9.9904, 10.0174, 10.132, 10.2839, 10.4464, 10.4829, 10.5435, 10.577, 10.5618, 10.5529, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5397, 10.5448, 10.5448, 10.5448, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q4',pts:[0.0, 0.1161, 2.3781, 4.6607, 5.5284, 6.1607, 6.6966, 7.2796, 7.8777, 8.1643, 9.1727, 9.3866, 9.6367, 9.7943, 9.7105, 10.0352, 10.15, 10.4546, 10.6856, 10.8912, 11.0086, 11.0635, 11.445, 11.4166, 11.4253, 11.6253, 11.6253, 11.6508, 11.6508, 11.6508, 11.6513, 11.6513, 11.6523, 11.6523, 11.6523, 11.6523, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q1',pts:[0.0, 0.2092, 3.6737, 5.1435, 5.6776, 6.801, 7.6814, 8.2896, 10.6827, 12.4686, 11.7595, 12.9992, 13.005, 13.3468, 13.7262, 13.9346, 12.767, 13.9081, 13.9346, 14.0285, 14.0977, 14.341, 14.341, 14.3213, 14.2659, 14.2659, 14.2659, 14.2659, 14.2659, 14.2659, 14.2655, 14.2593, 14.2593, 14.2593, 14.2593, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q2',pts:[0.0, 0.1859, 2.8736, 4.9304, 6.0252, 6.571, 7.42, 8.4396, 8.9515, 9.5729, 10.2286, 10.4426, 10.8187, 11.1099, 11.2671, 10.861, 10.8999, 11.4187, 10.6622, 10.6728, 10.6807, 10.7293, 10.7226, 10.7021, 10.7021, 10.7059, 10.7059, 10.7135, 10.7144, 10.7146, 10.7146, 10.7146, 10.7146, 10.7146, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q3',pts:[0.0, 0.2914, 3.9774, 5.5943, 6.7741, 7.5577, 9.0138, 9.8688, 10.2285, 11.7886, 11.9068, 11.9758, 12.0034, 12.2001, 12.4357, 12.612, 12.7344, 12.7501, 13.0254, 12.9983, 13.1265, 13.1501, 13.1621, 13.1615, 13.1615, 13.1611, 13.1916, 13.2195, 13.2184, 13.2605, 13.2605, 13.2605, 13.2605, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q4',pts:[0.0, 0.5071, 4.4221, 7.3126, 9.1521, 11.0951, 11.9851, 12.8341, 13.0751, 13.9192, 14.5977, 14.8134, 15.527, 15.6359, 15.9259, 15.7553, 15.6837, 15.7578, 15.7681, 15.8576, 15.9935, 16.1204, 16.3602, 16.2957, 16.261, 16.2625, 16.2588, 16.3168, 16.3292, 16.3377, 16.3359, 16.3355, null, null, null, null, null, null, null, null, null, null, null, null],implied:16.3629,defaultLC:16.3629,priorLC:16.3717},
  {aq:'2019Q1',pts:[0.0, 0.5225, 8.1545, 9.4767, 10.7289, 12.0488, 13.5281, 14.2228, 15.9227, 17.3779, 18.5502, 17.9791, 18.6426, 18.593, 19.0101, 19.0294, 19.1644, 20.3022, 21.3701, 21.3783, 21.4606, 21.5758, 21.6035, 21.5867, 21.6105, 21.6432, 21.6869, 21.772, 21.9829, 22.015, 21.9993, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:22.047,defaultLC:22.047,priorLC:22.0625},
  {aq:'2019Q2',pts:[0.0, 0.5471, 6.7053, 8.54, 9.8206, 10.4866, 11.3138, 11.7813, 11.6364, 12.4105, 13.612, 13.7598, 13.699, 13.9719, 14.0106, 14.6589, 14.9531, 14.8652, 14.9567, 14.8731, 14.8909, 14.8735, 14.8956, 14.9338, 14.9837, 14.9743, 14.9726, 15.0354, 15.0515, 15.0247, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:15.0546,defaultLC:15.0546,priorLC:15.6272},
  {aq:'2019Q3',pts:[0.0, 0.2252, 5.089, 6.9098, 7.7721, 8.5849, 9.69, 10.2546, 11.0641, 10.9016, 11.6184, 11.993, 12.1073, 12.455, 12.7348, 13.1621, 13.1369, 13.715, 13.6546, 13.8365, 14.3015, 14.3256, 14.4814, 14.3331, 14.3901, 14.4162, 14.434, 14.4646, 14.4646, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:14.5094,defaultLC:14.3898,priorLC:14.5452},
  {aq:'2019Q4',pts:[0.0, 0.7965, 4.9692, 6.3299, 7.039, 7.4348, 8.1598, 8.8359, 9.0042, 9.4902, 9.9387, 10.118, 10.2289, 10.2161, 10.3897, 10.3258, 10.3188, 10.4296, 10.38, 10.3797, 10.3558, 10.3753, 10.3969, 10.4161, 10.4162, 10.5873, 10.5873, 10.5931, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.6227,defaultLC:10.6227,priorLC:10.6752},
  {aq:'2020Q1',pts:[0.0, 0.9338, 6.7063, 8.2861, 9.2264, 10.1331, 11.3907, 12.0757, 12.1659, 12.5446, 13.6215, 14.8278, 14.9369, 14.9167, 14.9974, 15.5116, 15.7086, 15.9352, 15.9998, 16.3154, 16.6357, 17.3993, 18.9673, 19.1278, 20.355, 20.3634, 19.9268, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:20.3199,defaultLC:19.9461,priorLC:20.5487},
  {aq:'2020Q2',pts:[0.0, 0.5505, 5.2595, 5.9131, 7.3732, 7.9119, 8.9758, 9.6903, 9.5743, 10.6338, 11.3192, 11.4603, 11.1982, 11.3024, 11.5342, 11.8168, 10.3452, 10.3456, 10.3456, 10.3745, 10.3745, 10.4007, 10.4007, 10.4007, 10.4007, 10.4007, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.5265,defaultLC:10.5265,priorLC:10.55},
  {aq:'2020Q3',pts:[0.0, 0.5739, 4.6398, 5.665, 7.1336, 7.8747, 9.2453, 9.8586, 10.3673, 10.2723, 10.8669, 11.6385, 10.6425, 10.5397, 10.3689, 10.3689, 10.3689, 10.3689, 10.3932, 10.4357, 10.4672, 10.4818, 10.4818, 10.5049, 10.5049, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.6585,defaultLC:10.6585,priorLC:10.7254},
  {aq:'2020Q4',pts:[0.0, 0.7336, 6.5506, 8.0914, 8.4241, 9.0875, 10.7162, 11.2855, 11.3831, 11.5539, 11.4549, 12.0647, 12.3214, 12.3654, 12.3478, 12.4444, 12.5697, 13.0752, 13.0816, 13.1547, 13.6165, 13.6484, 13.6547, 13.5496, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:13.8347,defaultLC:13.8347,priorLC:14.0194},
  {aq:'2021Q1',pts:[0.0, 1.2524, 5.4368, 6.4412, 7.1699, 7.8463, 8.8106, 9.2571, 10.4497, 10.5945, 10.5287, 10.7345, 11.0828, 11.1388, 11.2622, 11.3699, 11.4124, 11.6371, 11.0597, 11.2054, 11.3653, 11.3653, 11.3697, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.4593,defaultLC:11.4593,priorLC:11.5935},
  {aq:'2021Q2',pts:[0.0, 0.8267, 6.0437, 6.8101, 6.797, 8.0236, 9.4999, 9.5932, 9.1892, 9.8934, 10.1352, 9.6902, 9.6923, 9.6964, 9.6977, 9.7015, 9.6563, 9.603, 9.603, 9.6386, 9.6386, 9.6741, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.0498,defaultLC:10.0498,priorLC:10.1778},
  {aq:'2021Q3',pts:[0.0, 0.7042, 4.8763, 4.4586, 5.2984, 6.0747, 6.6337, 6.7101, 7.023, 7.2523, 7.6664, 7.5986, 7.9524, 7.9912, 8.1257, 8.1438, 8.1698, 7.8929, 7.621, 7.6211, 7.3572, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:7.7864,defaultLC:7.7864,priorLC:8.0948},
  {aq:'2021Q4',pts:[0.0, 0.9316, 4.5895, 6.1901, 7.2112, 7.9314, 8.6083, 9.1761, 9.9632, 11.3952, 10.417, 10.9806, 11.1499, 11.1257, 11.6513, 11.7344, 11.8462, 11.8728, 11.9806, 12.3096, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.6696,defaultLC:12.6696,priorLC:12.5828},
  {aq:'2022Q1',pts:[0.0, 0.8792, 4.4196, 7.2504, 8.4069, 9.5023, 10.4965, 10.8758, 11.6255, 12.0084, 11.4687, 11.2006, 11.4759, 11.3043, 11.261, 11.0827, 11.2983, 11.0275, 11.2109, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.081,defaultLC:12.081,priorLC:11.9016},
  {aq:'2022Q2',pts:[0.0, 0.6543, 4.2586, 5.9022, 6.9212, 7.2257, 7.6277, 7.8329, 8.3273, 8.7935, 8.6848, 9.0348, 8.9998, 9.0093, 8.9368, 8.9853, 9.036, 9.0268, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.8161,defaultLC:9.8161,priorLC:9.9033},
  {aq:'2022Q3',pts:[0.0, 1.1353, 4.7223, 6.3451, 7.1462, 7.5796, 7.8942, 8.0724, 9.3204, 10.133, 10.304, 10.4138, 10.4094, 10.5038, 10.5269, 10.5319, 10.6072, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.379,defaultLC:11.379,priorLC:11.4154},
  {aq:'2022Q4',pts:[0.0, 0.7036, 3.6903, 4.6524, 5.9536, 6.4627, 6.841, 7.1775, 8.3533, 8.1395, 8.5701, 8.3469, 8.2965, 8.4946, 8.686, 8.6341, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:9.4987,defaultLC:9.4987,priorLC:9.5958},
  {aq:'2023Q1',pts:[0.0, 0.7681, 4.7901, 5.9128, 7.1672, 7.7665, 8.1193, 8.5048, 8.8522, 9.3676, 9.9017, 10.2331, 10.0887, 10.2855, 10.3038, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.1748,defaultLC:11.1748,priorLC:11.3557},
  {aq:'2023Q2',pts:[0.0, 0.4674, 4.5962, 6.4299, 6.9057, 7.3231, 7.873, 8.3907, 8.9116, 9.5432, 10.2994, 10.8009, 11.3041, 11.4339, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.1854,defaultLC:12.1854,priorLC:12.681},
  {aq:'2023Q3',pts:[0.0, 0.7564, 4.2814, 5.0506, 5.5887, 6.351, 6.9026, 7.1501, 7.1585, 7.7338, 7.7868, 7.8055, 8.0937, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:8.7248,defaultLC:8.7248,priorLC:8.4284},
  {aq:'2023Q4',pts:[0.0, 0.7191, 4.9966, 6.1966, 7.6064, 8.545, 9.3684, 9.6412, 9.9488, 10.2648, 10.8145, 10.8552, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.0088,defaultLC:12.0088,priorLC:12.4585},
  {aq:'2024Q1',pts:[0.0, 0.7649, 4.7331, 6.0377, 7.0658, 7.6278, 8.1973, 8.7795, 9.4773, 9.3583, 9.5521, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:10.9174,defaultLC:10.9174,priorLC:11.404},
  {aq:'2024Q2',pts:[0.0, 0.817, 5.6626, 8.1615, 9.1539, 10.1263, 10.5947, 10.8901, 11.6133, 12.0979, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:14.451,defaultLC:14.451,priorLC:14.8682},
  {aq:'2024Q3',pts:[0.0, 0.6051, 4.087, 5.3512, 6.8289, 7.6258, 8.7149, 9.0791, 9.4586, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.518,defaultLC:11.518,priorLC:11.7096},
  {aq:'2024Q4',pts:[0.0, 0.7828, 5.6389, 7.4256, 8.7907, 9.5731, 10.0351, 10.5586, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:13.6036,defaultLC:13.6036,priorLC:13.7877},
  {aq:'2025Q1',pts:[0.0, 1.2573, 5.6443, 7.397, 9.07, 9.8026, 10.2215, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:14.4523,defaultLC:14.4523,priorLC:14.8855},
  {aq:'2025Q2',pts:[0.0, 0.7836, 5.7366, 7.2407, 8.679, 9.5696, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:14.0313,defaultLC:14.0313,priorLC:14.6975},
  {aq:'2025Q3',pts:[0.0, 1.0798, 5.253, 6.5425, 7.2353, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:14.196,defaultLC:14.196,priorLC:16.2211},
  {aq:'2025Q4',pts:[0.0, 1.0159, 5.7745, 7.4577, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:16.4269,defaultLC:16.1989,priorLC:16.9867},
  {aq:'2026Q1',pts:[0.0, 0.8961, 5.3969, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:17.0794,defaultLC:16.828,priorLC:15.8822},
  {aq:'2026Q2',pts:[0.0, 0.825, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:null,defaultLC:16.5362,priorLC:19.38},
];
const BI_DATA = [
  {aq:'2015Q4',pts:[0.0, 1.0355, 3.0158, 4.3297, 5.3122, 7.4641, 9.4713, 11.1721, 12.4479, 15.8301, 16.4746, 18.2352, 18.6038, 20.1615, 21.7646, 24.7363, 33.3056, 33.8637, 33.7442, 34.4509, 34.2305, 34.1427, 34.1427, 34.15, 34.1499, 33.1263, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275, 33.1275],implied:33.1275,defaultLC:33.1275,priorLC:33.1275},
  {aq:'2016Q1',pts:[0.0, 0.1463, 2.4148, 3.6732, 6.0983, 8.1366, 10.8142, 14.0384, 23.0704, 26.3139, 31.0789, 32.3204, 35.5909, 37.079, 42.0603, 42.6821, 42.5597, 42.5867, 43.0553, 43.3957, 44.4109, 44.4609, 44.5206, 44.5206, 44.5206, 44.5206, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457, 44.4457],implied:44.4457,defaultLC:44.4457,priorLC:null},
  {aq:'2016Q2',pts:[0.0, 0.2621, 2.4444, 5.1643, 8.7967, 11.0689, 13.1085, 17.0625, 18.8111, 20.8857, 23.0545, 23.7398, 24.8894, 28.2345, 28.5965, 29.521, 34.6951, 34.749, 35.3672, 35.5804, 35.5804, 35.7398, 35.7398, 34.9824, 35.0139, 35.6596, 35.7792, 42.316, 42.1184, 41.9461, 41.9461, 41.8208, 41.8208, 41.8209, 41.9804, 39.7893, 39.7586, 39.7586, 39.7586, 39.7592, 39.7592],implied:39.7592,defaultLC:null,priorLC:null},
  {aq:'2016Q3',pts:[0.0, 0.2062, 3.4076, 9.8181, 13.5293, 23.3211, 28.9974, 32.7899, 37.6079, 40.7314, 42.4906, 43.8551, 47.446, 49.9024, 50.7125, 54.2574, 58.5798, 61.8531, 63.2331, 63.6414, 63.6711, 63.4734, 63.4878, 63.4878, 63.4878, 63.4878, 63.4878, 63.4878, 63.4878, 63.4878, 63.5943, 63.5943, 63.5235, 63.4915, 63.4915, 63.4915, 63.4877, 63.4877, 63.4877, 63.4877, 63.4877],implied:null,defaultLC:null,priorLC:null},
  {aq:'2016Q4',pts:[0.0, 0.4655, 3.4955, 6.3315, 16.5493, 22.9002, 28.5594, 32.5753, 34.9746, 40.8147, 46.2703, 49.9008, 50.1639, 53.2603, 55.7556, 63.474, 63.9421, 66.8964, 65.9051, 65.918, 65.8563, 65.832, 65.8148, 65.8148, 65.8149, 65.8172, 65.8172, 65.8313, 65.8313, 65.8313, 65.8313, 65.8313, 65.8313, 65.8313, 65.8313, 65.829, 65.829, 65.829, 65.829, 65.829, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q1',pts:[0.0, 0.3238, 4.2747, 8.4458, 12.47, 15.2908, 16.6945, 18.2173, 21.5033, 23.5253, 29.9007, 34.8982, 40.2827, 42.6121, 44.8573, 49.2455, 51.2647, 51.6746, 53.9869, 54.3717, 54.2592, 53.5568, 53.5787, 53.5931, 55.2186, 55.5569, 56.0492, 56.0146, 55.9993, 55.9993, 55.9993, 55.9993, 55.9993, 55.9993, 55.9975, 55.9975, 55.9975, 55.9975, 55.9975, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q2',pts:[0.0, 0.3196, 8.8285, 16.7001, 20.4012, 24.3125, 27.1834, 30.8993, 34.5733, 37.3139, 39.7397, 43.8484, 49.5298, 54.1487, 54.7685, 55.3603, 57.7272, 57.5332, 57.6303, 57.6155, 58.0099, 55.6422, 55.7096, 55.725, 55.7342, 55.628, 55.6251, 55.6209, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, 55.6205, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q3',pts:[0.0, 0.7236, 13.707, 19.8421, 23.7759, 27.4287, 31.157, 33.5699, 36.9209, 41.157, 47.1956, 53.2594, 57.3121, 59.5556, 62.8698, 63.5715, 70.3792, 70.608, 69.5317, 73.1481, 73.5694, 73.3062, 73.1957, 73.2973, 73.3769, 73.6939, 73.7426, 73.7107, 73.6944, 73.6955, 73.6955, 73.6955, 73.6956, 73.6956, 73.6956, 73.6956, 73.6956, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q4',pts:[0.0, 0.5935, 8.7898, 14.5515, 17.731, 22.0989, 28.4937, 30.1972, 33.399, 37.5338, 41.0953, 45.5819, 46.7785, 47.9364, 49.9753, 52.3037, 52.4087, 55.2297, 55.4098, 56.4624, 56.4723, 56.3281, 56.46, 56.9316, 56.9014, 56.9014, 57.0836, 57.0913, 57.2731, 57.2731, 57.2731, 57.2711, 57.2711, 57.2639, 57.2745, 57.2713, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q1',pts:[0.0, 1.3953, 18.3428, 21.0091, 24.9444, 27.8272, 31.5061, 33.8974, 37.4683, 45.3673, 49.6983, 56.4469, 62.1792, 63.5632, 65.8803, 70.1809, 72.852, 75.8558, 80.9011, 80.4697, 80.2141, 80.0789, 80.163, 80.0519, 80.0405, 79.9979, 79.9973, 79.4631, 79.4611, 79.4611, 79.4746, 79.475, 79.475, 79.475, 79.475, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q2',pts:[0.0, 1.9429, 10.9795, 13.7671, 16.0336, 19.2475, 20.7646, 25.092, 26.7836, 30.9709, 38.2232, 42.5979, 43.1087, 46.0362, 48.8071, 49.6232, 50.7129, 53.0204, 53.0286, 53.7093, 53.9716, 54.2763, 55.31, 55.9115, 55.822, 58.3579, 58.3515, 58.9464, 58.9459, 59.3089, 59.6637, 59.6591, 59.6617, 59.6672, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q3',pts:[0.0, 0.9999, 8.7615, 12.0965, 16.4975, 22.4247, 27.2124, 33.8691, 39.1852, 45.0401, 49.9497, 52.1919, 55.7221, 56.5188, 60.9001, 61.9466, 63.8008, 64.7801, 69.3143, 69.275, 69.3934, 70.5282, 71.7654, 71.9748, 72.1452, 72.1719, 72.1548, 72.3009, 72.0476, 71.9397, 71.2782, 71.2782, 71.4969, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q4',pts:[0.0, 1.0622, 9.5859, 13.961, 18.5084, 34.4912, 46.0047, 51.4831, 55.3725, 61.0088, 66.5856, 69.4303, 71.7079, 75.534, 78.3509, 80.409, 81.9591, 82.6191, 82.7329, 85.2121, 85.929, 86.1279, 86.4869, 86.4954, 88.7704, 88.1132, 88.0876, 88.0788, 88.0739, 88.0974, 88.0947, 88.0335, null, null, null, null, null, null, null, null, null, null, null, null],implied:88.0399,defaultLC:88.0399,priorLC:88.1727},
  {aq:'2019Q1',pts:[0.0, 1.0108, 23.9401, 32.0933, 40.4486, 45.7367, 50.9658, 54.823, 56.7484, 60.5275, 66.836, 69.3908, 74.1293, 75.9672, 82.0692, 88.1313, 91.0949, 93.7829, 93.308, 94.0526, 94.8949, 97.1567, 96.4167, 98.0645, 98.0598, 97.9427, 97.937, 97.7784, 97.8314, 97.8314, 97.8322, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:97.8388,defaultLC:97.8388,priorLC:97.9735},
  {aq:'2019Q2',pts:[0.0, 0.8757, 22.9868, 32.6766, 39.2366, 43.0257, 47.9647, 51.7597, 56.7847, 62.477, 67.7957, 70.1454, 75.1481, 78.2642, 81.7909, 84.0887, 86.1197, 86.0239, 86.4015, 86.9223, 88.1089, 88.6189, 88.7054, 88.6871, 88.8743, 89.0964, 88.2315, 88.524, 89.2745, 89.6107, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:89.6167,defaultLC:89.2922,priorLC:89.2745},
  {aq:'2019Q3',pts:[0.0, 0.8625, 19.919, 27.6986, 33.6012, 38.9153, 44.1128, 48.7633, 54.0552, 59.2047, 66.7581, 71.3421, 76.3318, 83.2077, 85.5674, 88.7738, 91.2251, 93.1871, 93.6479, 94.2798, 94.3156, 95.1563, 95.5877, 95.7346, 96.1815, 96.2462, 96.226, 96.2359, 97.1517, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:96.9467,defaultLC:96.8177,priorLC:96.1186},
  {aq:'2019Q4',pts:[0.0, 3.1285, 19.5453, 26.0837, 30.7455, 33.5511, 38.4276, 42.6492, 46.0486, 51.0412, 55.0829, 58.7592, 66.2928, 70.3665, 72.0183, 74.672, 77.0456, 79.8044, 81.2548, 83.6814, 83.6979, 84.3243, 85.3194, 84.9229, 85.0017, 85.0982, 85.1066, 85.0978, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:85.2391,defaultLC:85.2391,priorLC:85.6398},
  {aq:'2020Q1',pts:[0.0, 1.7523, 14.3726, 19.2468, 21.9925, 23.3445, 27.1643, 30.1543, 33.6491, 37.767, 42.2002, 45.0832, 48.9594, 52.2781, 55.5481, 57.5169, 58.7259, 59.5887, 62.2887, 65.8151, 66.2609, 67.6217, 68.7066, 68.8533, 69.6273, 69.6362, 69.6432, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:69.7888,defaultLC:69.7888,priorLC:69.7055},
  {aq:'2020Q2',pts:[0.0, 0.7619, 20.4071, 24.3467, 26.6007, 26.6246, 32.2193, 36.8844, 38.6076, 40.9225, 45.4688, 46.6957, 47.3998, 48.3258, 49.918, 51.1645, 57.3055, 58.7082, 59.1538, 59.628, 59.6334, 59.7426, 59.884, 60.8713, 60.8809, 61.0434, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:60.1794,defaultLC:60.1794,priorLC:60.7445},
  {aq:'2020Q3',pts:[0.0, 1.8891, 31.0071, 41.7799, 42.5136, 48.8015, 54.0461, 56.9192, 65.2803, 74.5261, 75.6748, 77.6823, 81.2289, 83.3427, 86.2733, 88.5978, 89.56, 90.0601, 90.6032, 92.3409, 94.8378, 95.4207, 95.5047, 95.5162, 95.5839, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:96.0834,defaultLC:95.5587,priorLC:96.9407},
  {aq:'2020Q4',pts:[0.0, 5.2469, 30.9474, 36.6869, 41.5367, 48.4721, 52.6672, 57.2006, 62.1979, 66.1419, 69.618, 71.1824, 74.4702, 78.9519, 79.5235, 81.1753, 82.0432, 83.5495, 84.1441, 86.3173, 87.1965, 88.0383, 88.0294, 88.1693, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:89.107,defaultLC:89.107,priorLC:90.3082},
  {aq:'2021Q1',pts:[0.0, 1.5525, 18.0135, 18.931, 21.6651, 26.7354, 28.3517, 37.422, 40.6664, 45.4125, 48.129, 50.4113, 56.4934, 62.3957, 65.647, 65.9417, 66.6359, 68.8685, 69.6796, 70.1293, 71.1202, 71.0953, 71.0088, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:72.0577,defaultLC:72.0577,priorLC:73.4382},
  {aq:'2021Q2',pts:[0.0, 2.0807, 20.4152, 28.4415, 31.6127, 34.7784, 39.0075, 41.975, 44.4828, 48.6477, 50.7018, 52.9324, 57.4494, 59.7157, 61.3835, 64.4349, 68.5784, 71.7878, 73.1449, 76.5633, 77.9537, 79.5009, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:79.4453,defaultLC:78.7044,priorLC:78.4373},
  {aq:'2021Q3',pts:[0.0, 2.6124, 22.8187, 28.1562, 31.7188, 36.0184, 45.409, 48.3316, 55.0756, 60.4601, 63.5718, 67.2549, 68.2267, 71.9871, 73.597, 75.0882, 75.545, 76.3863, 77.9139, 77.1047, 78.6529, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:80.7257,defaultLC:78.777,priorLC:80.604},
  {aq:'2021Q4',pts:[0.0, 3.248, 17.931, 22.9482, 25.6032, 28.8864, 35.5723, 40.9092, 44.1396, 47.9442, 51.3544, 54.1905, 56.5499, 58.9696, 60.2926, 62.592, 67.0437, 69.3103, 70.1741, 70.9751, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:74.1943,defaultLC:70.3717,priorLC:73.7702},
  {aq:'2022Q1',pts:[0.0, 1.7752, 15.112, 20.3626, 24.1957, 32.9106, 37.1626, 39.11, 43.4247, 46.1805, 49.4507, 52.9978, 55.6923, 61.4812, 63.6345, 68.8359, 69.7363, 73.835, 74.5265, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:79.8958,defaultLC:77.5933,priorLC:81.5072},
  {aq:'2022Q2',pts:[0.0, 2.3046, 16.4722, 19.5906, 25.2506, 30.8267, 35.1904, 38.9307, 44.3865, 50.9409, 53.1191, 57.5192, 61.217, 62.8478, 63.9062, 68.4358, 69.8172, 70.9832, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:77.3824,defaultLC:72.7884,priorLC:77.4727},
  {aq:'2022Q3',pts:[0.0, 2.069, 20.488, 25.0878, 33.2151, 38.469, 40.4033, 44.9292, 49.5309, 56.3791, 63.1773, 67.6487, 72.7612, 76.7429, 77.9237, 78.4975, 80.1787, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:90.6528,defaultLC:86.4109,priorLC:91.6383},
  {aq:'2022Q4',pts:[0.0, 3.1699, 17.488, 24.9192, 29.2712, 32.364, 34.1325, 38.2845, 43.1088, 49.1768, 51.1215, 55.478, 58.6055, 60.3258, 63.2596, 69.6618, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:78.1713,defaultLC:75.9316,priorLC:75.6633},
  {aq:'2023Q1',pts:[0.0, 2.5701, 18.1674, 23.8286, 29.39, 33.8099, 36.2814, 42.4427, 46.6155, 54.349, 58.1766, 61.2844, 66.5055, 70.363, 73.3611, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:86.5073,defaultLC:83.0572,priorLC:86.7927},
  {aq:'2023Q2',pts:[0.0, 5.0873, 18.6529, 25.8421, 30.6043, 34.0068, 39.2256, 42.9465, 46.5292, 52.5185, 55.7798, 60.049, 61.0646, 64.1804, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:81.5636,defaultLC:77.497,priorLC:82.328},
  {aq:'2023Q3',pts:[0.0, 3.8861, 21.5043, 23.6824, 29.1142, 34.0251, 43.0368, 47.3093, 56.4669, 61.7902, 67.8606, 71.3054, 74.98, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:95.4614,defaultLC:90.2525,priorLC:95.1257},
  {aq:'2023Q4',pts:[0.0, 4.6824, 22.1057, 26.8003, 32.3036, 41.0811, 45.4503, 51.5653, 60.1973, 69.1598, 72.0536, 77.9629, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:107.2118,defaultLC:98.5452,priorLC:105.9923},
  {aq:'2024Q1',pts:[0.0, 4.5605, 21.7068, 26.6829, 36.5125, 42.6598, 49.3657, 54.6997, 63.6756, 69.6348, 73.4223, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:110.8546,defaultLC:98.5129,priorLC:111.1653},
  {aq:'2024Q2',pts:[0.0, 4.5584, 25.6611, 32.6613, 40.6076, 49.5641, 63.2471, 70.4473, 74.377, 81.8635, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:124.0291,defaultLC:114.8923,priorLC:123.7876},
  {aq:'2024Q3',pts:[0.0, 4.4663, 24.1169, 31.276, 39.832, 47.6209, 57.1594, 66.2604, 70.5895, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:125.7187,defaultLC:112.7938,priorLC:126.8618},
  {aq:'2024Q4',pts:[0.0, 6.5032, 31.1687, 41.5856, 49.3312, 56.4026, 62.8324, 69.742, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:137.6142,defaultLC:126.7773,priorLC:137.3715},
  {aq:'2025Q1',pts:[0.0, 5.7798, 30.5608, 37.8577, 50.2543, 57.3745, 65.2023, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:146.5948,defaultLC:133.0648,priorLC:147.3919},
  {aq:'2025Q2',pts:[0.0, 5.7799, 30.4236, 41.2031, 48.8633, 57.5678, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:146.9322,defaultLC:134.8153,priorLC:146.3906},
  {aq:'2025Q3',pts:[0.0, 7.27, 32.9388, 40.5395, 54.0689, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:147.254,defaultLC:136.1511,priorLC:144.5118},
  {aq:'2025Q4',pts:[0.0, 6.4655, 28.4888, 43.0706, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:169.7834,defaultLC:156.4775,priorLC:168.4078},
  {aq:'2026Q1',pts:[0.0, 5.9092, 37.2733, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:169.5528,defaultLC:157.7333,priorLC:170.1207},
  {aq:'2026Q2',pts:[0.0, 20.4012, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:null,defaultLC:171.2152,priorLC:175.9965},
];
const BIFL_DATA = [
  {aq:'2015Q4',pts:[0.0, 0.372, 135.4317, 137.9474, 141.9043, 145.1744, 146.2913, 179.5663, 180.169, 230.39, 230.39, 230.2733, 230.2733, 230.2733, 230.2733, 230.2733, 230.2733, 230.6453, 234.9244, 234.9244, 231.2295, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482, 231.1482],implied:231.1482,defaultLC:231.1482,priorLC:231.1482},
  {aq:'2016Q1',pts:[0.0, 0.6945, 6.8364, 7.2299, 9.683, 16.1153, 29.1592, 42.8414, 60.2935, 61.2406, 62.2081, 62.5218, 66.1848, 65.4446, 67.7997, 68.3543, 73.1807, 100.1376, 100.8399, 100.5343, 101.4236, 102.233, 102.2506, 102.3981, 102.1362, 102.1362, 102.1362, 102.1362, 102.1362, 102.1362, 102.1362, 102.1362, 102.1362, 102.2238, 102.1584, 102.1584, 102.1584, 102.1584, 102.1584, 102.1584, 102.1584],implied:102.1584,defaultLC:102.1584,priorLC:null},
  {aq:'2016Q2',pts:[0.0, 0.0405, 1.3296, 2.2372, 5.5968, 9.1193, 17.5322, 34.2703, 68.8392, 75.8897, 76.1291, 78.0517, 78.0786, 76.9343, 79.8448, 112.628, 118.3847, 117.8303, 113.9466, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155, 113.9155],implied:113.9155,defaultLC:null,priorLC:null},
  {aq:'2016Q3',pts:[0.0, 0.0158, 4.5679, 7.1137, 10.136, 27.1875, 92.4327, 100.0295, 109.3605, 113.183, 113.2662, 113.991, 114.1743, 114.5137, 116.1947, 116.9467, 93.4057, 92.667, 93.7865, 94.0285, 94.3351, 95.3082, 95.3082, 95.3082, 95.3082, 95.3082, 93.8826, 101.0195, 101.2121, 101.3588, 101.7623, 112.7662, 112.6424, 112.6424, 112.6424, 112.6424, 112.6424, 112.6424, 112.6424, 112.6424, 112.6424],implied:null,defaultLC:null,priorLC:null},
  {aq:'2016Q4',pts:[0.0, 0.466, 2.2104, 7.4918, 15.7077, 42.8098, 63.8448, 72.1975, 76.3752, 74.7119, 75.4082, 69.4786, 79.6331, 73.5839, 72.7655, 83.4007, 80.9979, 81.4189, 81.9824, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, 82.0025, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q1',pts:[0.0, 0.429, 3.1163, 9.9652, 22.3621, 43.027, 59.2236, 60.946, 64.0168, 69.7619, 72.276, 83.2248, 85.0043, 89.8459, 89.2296, 89.7709, 97.2141, 98.4529, 98.2671, 99.8826, 100.1916, 99.8342, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, 99.5628, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q2',pts:[0.0, 0.0436, 9.6877, 27.902, 41.3878, 54.5264, 54.3511, 60.4469, 63.7245, 65.6455, 68.6626, 77.2672, 82.0837, 80.332, 80.248, 81.9287, 83.4099, 86.1417, 86.0177, 86.5351, 86.5351, 88.3618, 99.5482, 105.8617, 106.6, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, 106.299, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q3',pts:[0.0, 0.4509, 11.7971, 17.2389, 41.9933, 46.5955, 52.9758, 56.0347, 57.6186, 49.4079, 57.5465, 59.9411, 70.908, 70.6034, 70.5371, 70.4304, 70.4574, 72.3025, 72.3025, 72.5588, 72.5391, 71.9384, 71.6021, 72.0649, 72.5277, 72.5277, 72.5277, 73.5303, 73.7617, 73.7617, 73.7617, 74.6872, 76.3841, 76.3841, 76.3841, 76.3841, 76.3841, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q4',pts:[0.0, 0.1887, 16.6652, 26.0688, 31.3808, 42.253, 52.9038, 57.1501, 67.4469, 75.9185, 83.0383, 89.026, 105.1111, 122.3558, 123.7654, 127.3592, 129.073, 142.3943, 142.5328, 142.6711, 144.7803, 144.6456, 148.2759, 150.1861, 151.5069, 152.051, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, 151.9564, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q1',pts:[0.0, 0.4023, 22.2088, 26.7488, 30.5838, 38.4687, 44.7225, 46.4433, 53.7963, 68.0054, 74.4664, 75.8373, 75.8524, 83.7932, 85.6432, 84.3708, 89.3278, 89.6294, 91.6395, 92.3655, 92.5716, 92.5069, 92.4935, 92.6385, 92.6385, 96.2333, 96.2333, 96.2934, 96.2934, 96.2934, 96.2934, 96.2934, 96.2934, 96.2934, 96.2934, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q2',pts:[0.0, 1.6358, 21.2212, 29.088, 36.7722, 48.3349, 56.4684, 74.0226, 93.5275, 106.387, 123.4232, 125.8036, 130.1407, 133.0342, 136.3662, 146.5018, 146.3262, 146.6323, 154.8711, 159.9113, 160.3147, 168.6985, 165.1379, 165.0868, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, 165.0848, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q3',pts:[0.0, 1.2805, 9.1372, 17.9899, 24.5022, 38.5384, 52.1918, 72.9229, 73.3558, 73.9063, 76.4035, 76.1438, 80.1516, 81.435, 85.7129, 87.3719, 91.3403, 92.2851, 97.7634, 98.133, 105.6722, 109.9463, 116.3044, 116.2302, 116.2219, 116.2387, 116.2387, 116.2387, 116.2387, 116.2387, 116.2387, 116.2387, 116.2387, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q4',pts:[0.0, 0.768, 14.3954, 22.3361, 42.7078, 69.393, 84.414, 113.1537, 119.6197, 125.7774, 134.5682, 138.7856, 148.5202, 150.7082, 161.6547, 172.5724, 176.7551, 183.9487, 184.692, 192.4658, 192.5078, 196.9195, 195.0138, 195.1851, 195.1851, 195.1851, 195.1851, 195.297, 195.297, 195.1305, 195.1305, 195.2504, null, null, null, null, null, null, null, null, null, null, null, null],implied:195.8194,defaultLC:null,priorLC:197.8186},
  {aq:'2019Q1',pts:[0.0, 0.859, 16.8259, 21.5324, 36.0377, 42.6808, 51.6767, 59.0272, 63.4212, 69.531, 73.8171, 78.2582, 84.3829, 84.4028, 85.5625, 89.0884, 91.9058, 97.4766, 103.1991, 104.884, 110.8735, 112.6503, 116.1536, 116.1298, 116.1062, 116.1069, 116.1069, 115.8545, 115.8545, 115.8545, 115.8545, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:117.46,defaultLC:null,priorLC:117.46},
  {aq:'2019Q2',pts:[0.0, 1.0764, 39.5193, 52.2353, 63.3993, 75.2281, 87.7803, 95.8541, 105.4881, 113.7207, 117.1025, 121.4842, 129.8305, 133.7165, 140.5507, 149.1749, 148.3001, 150.0313, 151.7847, 161.9932, 161.6312, 162.0298, 161.4914, 161.613, 161.3368, 161.0334, 161.0937, 161.1081, 161.1081, 161.1081, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:163.3448,defaultLC:null,priorLC:163.3448},
  {aq:'2019Q3',pts:[0.0, 1.1428, 28.3392, 45.268, 63.1251, 85.2052, 93.0168, 111.748, 115.8416, 116.1942, 125.9568, 135.3939, 148.7597, 163.0217, 164.8811, 168.9683, 177.6162, 183.0736, 184.0622, 184.851, 185.0572, 185.0572, 185.598, 185.7138, 185.8681, 185.9629, 188.6764, 189.1008, 189.0771, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:191.4068,defaultLC:null,priorLC:191.4608},
  {aq:'2019Q4',pts:[0.0, 1.3277, 31.3106, 52.3484, 64.7264, 88.5735, 105.2082, 120.6829, 131.2982, 143.2407, 149.8006, 165.1447, 183.5306, 199.6978, 213.3401, 227.3614, 234.1525, 237.626, 238.242, 238.5282, 243.3298, 243.5918, 242.3178, 242.2965, 242.2965, 242.2881, 242.2881, 242.2881, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:245.7071,defaultLC:null,priorLC:246.4848},
  {aq:'2020Q1',pts:[0.0, 1.9284, 33.4083, 46.8105, 72.262, 97.253, 114.9253, 121.3918, 135.8871, 148.4729, 158.8783, 184.3227, 193.5416, 214.2358, 226.1857, 231.6023, 234.8964, 233.2116, 233.849, 234.7618, 237.0565, 238.092, 238.2081, 238.6729, 238.7082, 239.8314, 239.8324, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:244.0296,defaultLC:null,priorLC:243.1834},
  {aq:'2020Q2',pts:[0.0, 0.9716, 31.5519, 61.0769, 70.3117, 96.8068, 109.9025, 132.5146, 139.8637, 150.8746, 159.3908, 175.6013, 180.8878, 183.9053, 195.2996, 200.6075, 201.8623, 208.8549, 211.1397, 212.6049, 212.759, 212.759, 213.2365, 213.2365, 213.2365, 213.3317, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:216.02,defaultLC:null,priorLC:216.4389},
  {aq:'2020Q3',pts:[0.0, 1.2397, 22.383, 37.3323, 47.3327, 60.8882, 76.0005, 80.5034, 86.3643, 96.5998, 104.5927, 110.1804, 114.8023, 116.2095, 117.979, 119.3483, 117.2662, 123.1634, 125.2073, 125.2073, 127.5466, 127.4417, 128.7645, 128.6537, 128.7761, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:130.6727,defaultLC:null,priorLC:130.858},
  {aq:'2020Q4',pts:[0.0, 0.8003, 38.33, 56.6475, 86.1965, 120.6768, 137.0562, 148.8458, 157.3769, 163.2435, 168.5776, 174.577, 177.874, 203.1587, 203.9116, 209.5454, 210.5079, 211.8539, 212.0623, 215.8601, 216.1383, 219.9144, 218.638, 219.8981, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:223.8181,defaultLC:null,priorLC:223.4211},
  {aq:'2021Q1',pts:[0.0, 0.8697, 23.783, 35.3954, 61.6087, 77.6494, 99.0622, 115.906, 148.4773, 175.1925, 185.4541, 192.4658, 204.4022, 204.5558, 207.0863, 212.7607, 216.6217, 223.1958, 225.6636, 225.9946, 227.9773, 227.9242, 228.3194, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:233.841,defaultLC:null,priorLC:236.335},
  {aq:'2021Q2',pts:[0.0, 1.2523, 21.9083, 39.1034, 52.839, 79.6482, 106.4505, 119.4853, 130.6059, 144.7176, 155.2742, 166.4607, 173.6898, 176.8691, 178.7791, 179.8571, 180.579, 184.1661, 184.5504, 184.8706, 184.9888, 185.0608, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:193.2454,defaultLC:null,priorLC:198.8505},
  {aq:'2021Q3',pts:[0.0, 8.7636, 61.9431, 106.5399, 168.7643, 178.0365, 186.3254, 187.5462, 196.0316, 187.328, 196.4893, 203.0002, 207.1748, 205.577, 204.0606, 203.4861, 203.63, 204.6501, 204.4313, 203.6043, 204.0851, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:197.2262,defaultLC:null,priorLC:219.2334},
  {aq:'2021Q4',pts:[0.0, 10.0388, 71.817, 157.457, 226.3612, 244.6744, 250.6496, 253.4103, 267.9533, 262.035, 253.2295, 254.0989, 255.6029, 251.5866, 252.4375, 253.6309, 252.3203, 251.6829, 251.3608, 251.7463, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:253.6164,defaultLC:null,priorLC:275.4397},
  {aq:'2022Q1',pts:[0.0, 8.7673, 78.5927, 131.033, 194.628, 225.5068, 234.8865, 243.8869, 257.1255, 261.708, 262.8847, 264.6212, 272.1974, 271.6955, 267.6546, 265.9634, 265.3405, 263.2657, 262.279, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:269.7083,defaultLC:null,priorLC:291.965},
  {aq:'2022Q2',pts:[0.0, 21.7456, 104.6365, 146.2334, 181.7487, 200.2329, 233.5419, 248.3188, 253.8046, 262.4745, 268.1167, 275.2252, 280.9543, 286.8974, 285.6734, 286.0886, 279.495, 275.5068, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:274.8154,defaultLC:null,priorLC:318.0902},
  {aq:'2022Q3',pts:[0.0, 22.6137, 92.1862, 127.2874, 182.0795, 231.996, 262.8371, 292.7834, 313.5418, 322.9616, 341.5885, 341.3522, 343.8326, 343.6078, 341.1198, 343.7305, 348.9605, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:352.2956,defaultLC:null,priorLC:386.7591},
  {aq:'2022Q4',pts:[0.0, 6.0556, 46.6004, 72.1127, 76.3525, 81.1863, 95.2705, 115.9811, 140.8596, 184.7972, 203.2503, 228.0525, 254.9939, 262.1926, 265.2964, 272.8784, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:304.7546,defaultLC:null,priorLC:311.6456},
  {aq:'2023Q1',pts:[0.0, 8.5885, 45.8623, 50.783, 53.9838, 57.593, 70.4033, 96.1037, 128.9571, 150.7196, 193.5614, 227.7735, 230.1174, 238.8767, 250.6021, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:299.1202,defaultLC:null,priorLC:297.767},
  {aq:'2023Q2',pts:[0.0, 19.5327, 66.2363, 66.9838, 66.2722, 78.202, 77.2452, 89.027, 101.4005, 133.1591, 150.5952, 160.5598, 173.0577, 178.8595, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:215.1597,defaultLC:null,priorLC:209.2423},
  {aq:'2023Q3',pts:[0.0, 6.4636, 54.8435, 54.9037, 54.2783, 63.1387, 96.242, 113.3545, 146.3887, 191.8673, 201.8964, 210.4717, 225.7315, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:281.2661,defaultLC:null,priorLC:288.0197},
  {aq:'2023Q4',pts:[0.0, 9.1053, 42.1683, 40.3074, 56.5625, 83.4968, 99.027, 127.2909, 150.1386, 176.8871, 187.7828, 206.8058, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:300.3441,defaultLC:null,priorLC:306.0203},
  {aq:'2024Q1',pts:[0.0, 6.9783, 30.941, 51.0772, 82.7249, 101.0725, 136.1175, 165.3192, 186.6374, 201.0657, 219.3247, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:315.584,defaultLC:null,priorLC:355.9552},
  {aq:'2024Q2',pts:[0.0, 6.1966, 30.7176, 34.0887, 65.9248, 101.5979, 145.9913, 169.6029, 191.9359, 216.5744, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:344.4524,defaultLC:null,priorLC:409.6187},
  {aq:'2024Q3',pts:[0.0, 5.1496, 39.6957, 53.5487, 87.8058, 114.0752, 147.1702, 163.5301, 179.8705, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:317.1923,defaultLC:null,priorLC:401.1882},
  {aq:'2024Q4',pts:[0.0, 5.4768, 40.6679, 63.8231, 121.0157, 150.4121, 164.6999, 190.8328, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:425.8028,defaultLC:null,priorLC:506.8819},
  {aq:'2025Q1',pts:[0.0, 10.8936, 59.9481, 111.185, 150.4095, 173.6052, 197.2138, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:505.1932,defaultLC:null,priorLC:532.3719},
  {aq:'2025Q2',pts:[0.0, 7.3982, 58.9732, 91.3684, 117.7173, 138.3335, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:432.787,defaultLC:null,priorLC:514.0901},
  {aq:'2025Q3',pts:[0.0, 8.5557, 59.5432, 69.6955, 106.2151, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:413.8916,defaultLC:null,priorLC:491.0571},
  {aq:'2025Q4',pts:[0.0, 6.4462, 43.2034, 72.9614, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:406.7986,defaultLC:null,priorLC:540.4192},
  {aq:'2026Q1',pts:[0.0, 10.118, 72.8284, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:446.9577,defaultLC:null,priorLC:489.5202},
  {aq:'2026Q2',pts:[0.0, 11.9169, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:463.4939},
];
const UM_DATA = [
  {aq:'2015Q4',pts:[0.0, 0.2281, 1.4745, 5.4288, 6.231, 10.4299, 11.6159, 16.7921, 23.2825, 25.5405, 29.2462, 28.7875, 28.4613, 33.4683, 32.6732, 32.9203, 32.3281, 32.9574, 32.7711, 32.7241, 43.2407, 42.9166, 42.9582, 42.8786, 42.8786, 42.8786, 42.8786, 42.8786, 42.8786, 42.8786, 42.8786, 42.7792, 42.843, 44.5664, 44.5294, 44.5294, 44.5294, 44.5294, 44.5294, 44.5294, 44.5294],implied:44.5294,defaultLC:44.5294,priorLC:44.5294},
  {aq:'2016Q1',pts:[0.0, 0.0088, 1.4476, 1.8051, 2.6328, 4.7669, 6.6203, 10.4297, 11.623, 12.3166, 13.0576, 13.3842, 14.8463, 15.0714, 15.7247, 16.8407, 21.7301, 21.7841, 22.9, 22.9995, 22.4269, 22.4179, 22.7455, 22.8333, 22.8333, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7917, 22.7917, 22.7917, 22.7917],implied:22.7917,defaultLC:22.7917,priorLC:null},
  {aq:'2016Q2',pts:[0.0, 0.1032, 0.7835, 1.8309, 3.6771, 5.9069, 9.5107, 11.7188, 13.1605, 16.8943, 19.6863, 28.5222, 28.1925, 30.347, 30.4327, 30.4796, 31.486, 33.3556, 34.202, 36.217, 37.5924, 37.5551, 37.5824, 37.9819, 38.2143, 42.311, 42.3281, 43.1362, 43.1362, 48.4123, 46.876, 46.9511, 46.9511, 46.8996, 46.8996, 46.8996, 46.8996, 46.8996, 46.8996, 46.8996, 46.8996],implied:46.8996,defaultLC:null,priorLC:null},
  {aq:'2016Q3',pts:[0.0, 0.0432, 1.523, 3.0439, 5.8703, 14.0562, 17.7346, 25.089, 26.8381, 28.5636, 29.357, 31.137, 42.2141, 54.0197, 60.9983, 61.5108, 65.2256, 66.1649, 66.8084, 67.991, 68.2627, 68.7254, 68.7752, 68.8977, 68.8977, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857, 68.857],implied:null,defaultLC:null,priorLC:null},
  {aq:'2016Q4',pts:[0.0, 0.1008, 0.7233, 2.7282, 5.8815, 15.8604, 20.4793, 23.3008, 25.8002, 28.0706, 31.8943, 36.2707, 37.5095, 43.0912, 46.3068, 55.5519, 55.6209, 55.8884, 56.1278, 56.3045, 56.3908, 56.3647, 56.5243, 56.5385, 56.4863, 56.4387, 56.437, 56.4977, 56.5429, 56.8942, 57.1105, 57.0985, 57.0963, 57.0959, 57.0937, 57.0937, 57.0919, 57.0905, 57.0885, 57.0881, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q1',pts:[0.0, 0.136, 6.6691, 12.09, 17.2044, 19.8265, 25.6485, 27.2371, 28.2248, 28.6572, 35.0217, 37.3154, 42.867, 48.521, 48.6127, 50.2018, 49.9445, 51.0953, 52.4947, 54.6512, 55.1249, 55.2936, 59.9054, 61.5886, 61.9314, 61.9805, 62.3016, 62.2819, 62.2663, 62.2663, 63.049, 63.0345, 63.0339, 63.0338, 63.0338, 63.0338, 63.0338, 63.0338, 63.0331, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q2',pts:[0.0, 0.0558, 1.6574, 6.7573, 12.6912, 17.7975, 19.7777, 23.3826, 26.5384, 30.7061, 36.6982, 43.2729, 47.5197, 52.1712, 56.879, 61.1995, 62.0437, 64.2043, 68.7548, 72.2337, 71.7569, 71.5245, 71.666, 73.9884, 74.3901, 74.3918, 74.713, 74.9782, 76.7635, 76.9965, 77.4928, 77.498, 77.4973, 77.489, 77.4935, 77.4935, 77.4925, 77.4925, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q3',pts:[0.0, 0.0515, 5.8789, 9.1138, 12.9493, 16.5902, 19.3714, 20.8218, 23.0317, 25.674, 29.5162, 41.1471, 43.2128, 47.2965, 49.2702, 49.6927, 51.4022, 52.3273, 52.6105, 54.4809, 55.4306, 55.5297, 55.4794, 57.9181, 58.1309, 58.2079, 58.1762, 58.168, 58.1655, 58.2712, 58.2463, 58.1695, 58.1676, 58.1672, 58.1668, 58.1661, 58.1654, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2017Q4',pts:[0.0, 0.1442, 3.9078, 7.2168, 9.4517, 11.659, 13.4428, 16.7051, 21.1247, 24.0181, 30.0055, 30.6911, 35.3223, 37.4553, 37.9763, 40.7991, 43.0328, 43.9712, 46.535, 46.9492, 48.6124, 49.8573, 50.1002, 50.7327, 49.9686, 49.9437, 49.9302, 49.9302, 50.0933, 50.0484, 50.0406, 50.0399, 50.0399, 50.0393, 50.0393, 51.2278, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q1',pts:[0.0, 0.1799, 6.101, 8.6168, 12.4555, 15.4282, 20.2094, 24.8191, 32.7517, 43.1281, 50.9431, 55.0369, 58.5, 62.0976, 66.4314, 68.1325, 69.187, 70.11, 71.9708, 72.1463, 74.3296, 73.8811, 73.8282, 74.2281, 74.4603, 74.5677, 74.8447, 75.5071, 75.5914, 76.6697, 77.2632, 77.3248, 76.5559, 76.5559, 76.5559, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q2',pts:[0.0, 0.6289, 6.4482, 9.8251, 13.225, 18.5591, 22.5499, 33.0074, 42.2304, 46.2421, 53.8228, 56.4013, 58.6996, 62.6784, 65.6161, 71.2952, 72.1594, 73.8216, 74.7023, 75.6651, 75.7353, 76.2363, 76.0321, 76.0498, 76.0455, 76.2648, 76.2639, 76.289, 76.2821, 76.4417, 76.4412, 76.4402, 76.4402, 76.4607, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q3',pts:[0.0, 0.425, 5.5841, 8.5619, 12.6421, 16.4436, 21.3257, 29.1386, 35.2622, 40.9821, 46.5471, 47.2028, 49.2495, 50.2091, 51.4986, 54.5195, 55.5695, 57.1077, 57.5303, 58.4543, 58.9822, 59.0014, 58.9579, 58.9837, 59.009, 59.0186, 59.1131, 59.0389, 59.0438, 59.0452, 59.0451, 59.0448, 59.0441, null, null, null, null, null, null, null, null],implied:null,defaultLC:null,priorLC:null},
  {aq:'2018Q4',pts:[0.0, 0.4692, 5.7696, 9.5071, 12.2577, 26.2881, 33.0869, 39.2433, 42.4247, 44.4085, 47.004, 51.9401, 54.0024, 58.6242, 61.4473, 62.8996, 65.5305, 66.1197, 66.3511, 66.1632, 66.8119, 66.7315, 67.0832, 67.3669, 68.0728, 68.1645, 69.2555, 69.4246, 69.2921, 69.2849, 69.2843, 69.2827, null, null, null, null, null, null, null, null, null, null, null, null],implied:70.0983,defaultLC:69.4311,priorLC:70.6572},
  {aq:'2019Q1',pts:[0.0, 0.5356, 8.3125, 15.0365, 25.0303, 31.1072, 36.6104, 40.4541, 43.6274, 45.4601, 48.097, 50.1489, 52.9439, 55.4722, 58.2581, 59.8443, 61.1167, 61.8873, 63.0452, 63.6053, 64.2663, 64.3384, 64.8738, 65.8494, 66.6359, 66.7263, 67.8329, 68.4698, 68.4174, 68.3731, 68.3744, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:69.5581,defaultLC:68.5818,priorLC:70.5738},
  {aq:'2019Q2',pts:[0.0, 0.2149, 7.1343, 12.6947, 20.7255, 26.804, 30.5108, 35.283, 38.7942, 42.1579, 44.291, 46.5573, 49.0471, 50.5838, 52.0992, 54.4302, 55.0494, 56.0515, 56.1339, 56.3863, 56.6125, 57.0347, 57.1194, 57.3306, 57.4211, 57.4143, 57.3388, 57.434, 58.3487, 58.2686, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:59.3429,defaultLC:58.4845,priorLC:60.2293},
  {aq:'2019Q3',pts:[0.0, 0.4243, 6.2686, 11.2462, 17.1115, 22.1481, 26.9691, 29.9832, 33.9453, 37.8265, 42.4734, 45.2086, 46.9933, 48.925, 50.3279, 51.2268, 53.1671, 54.1513, 55.5956, 55.787, 55.8403, 56.427, 56.8382, 56.8631, 57.2161, 57.2094, 57.1696, 57.207, 57.2481, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:58.1331,defaultLC:57.5492,priorLC:58.6264},
  {aq:'2019Q4',pts:[0.0, 0.8458, 9.1101, 16.847, 23.4302, 29.2324, 34.222, 38.8289, 41.6986, 46.3059, 49.6155, 51.0226, 53.5904, 55.837, 57.1337, 57.9585, 58.6605, 59.161, 59.7904, 60.186, 60.6201, 60.886, 60.9975, 61.1868, 61.5988, 61.5852, 61.5676, 61.5553, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:63.2551,defaultLC:62.2639,priorLC:64.4876},
  {aq:'2020Q1',pts:[0.0, 0.7468, 10.3134, 17.1837, 28.6519, 36.591, 43.0019, 46.4604, 52.168, 54.5234, 57.1667, 59.1652, 61.5746, 64.1582, 65.1833, 66.3267, 67.2939, 67.8262, 68.678, 69.1293, 69.4068, 69.7266, 70.0715, 70.2506, 70.2762, 70.3061, 70.3058, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:72.5882,defaultLC:71.6272,priorLC:73.9113},
  {aq:'2020Q2',pts:[0.0, 0.388, 8.1051, 14.6301, 16.8327, 20.6657, 23.1908, 25.8357, 30.2438, 33.9452, 39.0875, 40.9634, 41.1409, 42.2247, 42.6368, 43.0458, 45.1011, 46.7979, 46.8361, 46.6144, 47.0621, 47.1604, 47.1932, 47.622, 47.6281, 47.6283, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:48.7981,defaultLC:48.7981,priorLC:48.9492},
  {aq:'2020Q3',pts:[0.0, 5.2233, 15.758, 17.7026, 22.1742, 27.393, 35.4847, 37.7331, 40.9358, 44.4514, 47.4865, 48.5992, 49.6708, 52.9667, 53.0318, 53.1151, 53.3764, 56.051, 56.0678, 55.6417, 55.6153, 55.6156, 55.623, 55.9842, 55.9865, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:57.4139,defaultLC:57.4139,priorLC:57.8919},
  {aq:'2020Q4',pts:[0.0, 0.9112, 5.7654, 8.4042, 9.9896, 10.3614, 11.2634, 12.0897, 12.1272, 12.0835, 11.9539, 12.3133, 12.6023, 13.2704, 12.9399, 13.0413, 13.0778, 12.9233, 13.0439, 12.9135, 13.0959, 13.0672, 12.9387, 12.9387, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:13.1958,defaultLC:13.1958,priorLC:13.3109},
  {aq:'2021Q1',pts:[0.0, 0.9936, 3.8819, 5.7066, 6.4356, 6.8095, 8.5359, 9.0338, 8.5303, 8.5758, 6.5764, 7.2751, 7.2777, 7.5806, 7.4817, 7.8078, 7.9498, 12.438, 14.0928, 14.351, 14.2727, 14.3334, 20.9739, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:21.5456,defaultLC:21.5251,priorLC:15.0928},
  {aq:'2021Q2',pts:[0.0, 0.3008, 5.4818, 7.7033, 8.3026, 8.1992, 9.5113, 10.1883, 10.1303, 10.6556, 11.4561, 11.5969, 11.3993, 11.627, 11.7667, 11.9278, 12.3663, 12.4074, 12.3645, 12.4337, 12.447, 12.431, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.8616,defaultLC:12.8616,priorLC:12.902},
  {aq:'2021Q3',pts:[0.0, 0.1483, 7.4951, 8.5087, 7.7888, 8.4738, 9.6624, 9.7471, 10.7168, 11.1616, 11.6601, 11.9183, 12.0202, 12.7187, 12.8067, 12.6588, 14.434, 15.1101, 15.6124, 15.5985, 16.9794, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:17.3188,defaultLC:17.3188,priorLC:16.1059},
  {aq:'2021Q4',pts:[0.0, 0.7223, 7.3866, 10.8823, 12.0369, 13.5303, 14.447, 16.8254, 17.1929, 17.8456, 17.2292, 17.4697, 19.4255, 19.6499, 21.8038, 22.4738, 22.1574, 22.1187, 22.2072, 24.1391, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:25.6889,defaultLC:25.6889,priorLC:22.432},
  {aq:'2022Q1',pts:[0.0, 0.2886, 5.3806, 7.4009, 8.5503, 9.7089, 11.2761, 13.3055, 15.6391, 16.9217, 18.4965, 19.7087, 22.097, 22.0666, 25.0769, 24.5991, 25.3489, 26.4844, 26.5327, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:27.7645,defaultLC:27.7645,priorLC:28.956},
  {aq:'2022Q2',pts:[0.0, 0.644, 7.2605, 11.7831, 11.9815, 16.9222, 17.2026, 19.532, 19.7606, 20.4243, 20.5386, 20.6992, 20.9052, 20.781, 22.9116, 23.8327, 23.896, 23.2509, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:25.0683,defaultLC:25.0683,priorLC:25.893},
  {aq:'2022Q3',pts:[0.0, 2.3601, 11.1558, 12.0973, 14.4007, 16.5884, 16.1908, 16.5748, 17.7395, 17.3105, 19.7498, 19.5579, 19.6786, 21.3009, 19.9729, 19.8575, 19.8919, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:22.5263,defaultLC:22.5263,priorLC:22.7592},
  {aq:'2022Q4',pts:[0.0, 1.7437, 8.6091, 11.6, 12.7209, 14.7371, 15.7662, 15.6123, 16.8051, 17.234, 17.9601, 18.5191, 18.8983, 19.6966, 19.4674, 19.5236, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:22.7163,defaultLC:22.7163,priorLC:23.5453},
  {aq:'2023Q1',pts:[0.0, 1.9093, 10.3022, 10.9942, 11.1535, 12.8596, 16.306, 16.1655, 16.7823, 17.3117, 18.0635, 19.0604, 18.2055, 18.2588, 18.838, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:22.3876,defaultLC:22.3876,priorLC:22.2997},
  {aq:'2023Q2',pts:[0.0, 1.8253, 12.078, 15.4164, 17.4092, 19.2705, 20.5705, 21.4008, 22.5484, 23.0988, 23.6805, 23.9437, 24.3577, 24.627, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:31.1422,defaultLC:31.1422,priorLC:32.2881},
  {aq:'2023Q3',pts:[0.0, 1.9981, 12.4148, 13.6748, 16.0945, 16.5747, 17.5481, 17.9949, 18.3022, 19.4182, 19.7603, 19.9636, 20.1788, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:25.9869,defaultLC:25.9869,priorLC:26.1469},
  {aq:'2023Q4',pts:[0.0, 2.7038, 11.9864, 15.0139, 17.4087, 18.6382, 19.9566, 20.3349, 20.9992, 22.2032, 22.9318, 23.6874, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:31.2128,defaultLC:31.2128,priorLC:30.6378},
  {aq:'2024Q1',pts:[0.0, 2.5749, 12.086, 14.3828, 15.9097, 16.9052, 18.0244, 18.5413, 19.3144, 20.2495, 21.3438, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:28.6354,defaultLC:28.6354,priorLC:27.8431},
  {aq:'2024Q2',pts:[0.0, 2.7833, 12.8472, 16.5277, 19.7014, 21.8083, 24.519, 25.6016, 28.0155, 29.6152, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:39.8623,defaultLC:39.8623,priorLC:39.0732},
  {aq:'2024Q3',pts:[0.0, 2.5095, 12.9994, 15.7676, 17.4547, 18.9912, 20.69, 21.6973, 23.0527, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:34.1772,defaultLC:34.1772,priorLC:33.9901},
  {aq:'2024Q4',pts:[0.0, 2.3467, 13.189, 14.8081, 16.0816, 17.9192, 18.9612, 20.2173, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:30.9824,defaultLC:30.9824,priorLC:30.371},
  {aq:'2025Q1',pts:[0.0, 4.1111, 14.4421, 15.5156, 16.2306, 17.6629, 18.4043, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:31.9133,defaultLC:31.9133,priorLC:33.5663},
  {aq:'2025Q2',pts:[0.0, 3.5542, 15.4653, 17.2061, 18.3553, 19.7988, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:35.3432,defaultLC:35.3432,priorLC:35.9654},
  {aq:'2025Q3',pts:[0.0, 3.5699, 15.4907, 17.0443, 18.6537, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:36.8232,defaultLC:36.8232,priorLC:36.89},
  {aq:'2025Q4',pts:[0.0, 3.7413, 19.4433, 25.7957, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:49.0423,defaultLC:47.4744,priorLC:44.1767},
  {aq:'2026Q1',pts:[0.0, 2.8655, 15.1599, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:45.6465,defaultLC:43.4694,priorLC:47.3192},
  {aq:'2026Q2',pts:[0.0, 3.1084, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:null,defaultLC:48.4421,priorLC:47.8645},
];
const UM250_DATA = [
  {aq:'2015Q4',pts:[0.0, 0.2281, 1.4745, 5.4286, 6.2309, 10.4297, 11.603, 15.4465, 21.232, 23.4901, 25.9143, 26.0421, 25.7144, 29.5178, 29.0823, 28.8841, 28.6008, 29.23, 29.0437, 28.9738, 31.1607, 30.7186, 30.748, 30.6684, 30.6684, 30.6684, 30.6684, 30.6684, 30.6684, 30.6684, 30.6684, 30.569, 30.6328, 32.3562, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192, 32.3192],implied:null},
  {aq:'2016Q1',pts:[0.0, 0.0088, 1.4476, 1.8051, 2.6328, 4.7669, 6.6203, 10.4297, 11.623, 12.3166, 13.0576, 13.3842, 14.8463, 15.0714, 15.7247, 16.8407, 21.0273, 21.0812, 22.1972, 22.2967, 22.4269, 22.4179, 22.7455, 22.8333, 22.8333, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7886, 22.7917, 22.7917, 22.7917, 22.7917, 22.7917, 22.7917, null],implied:null},
  {aq:'2016Q2',pts:[0.0, 0.1032, 0.7835, 1.8309, 3.6771, 5.9069, 9.5107, 11.7188, 13.1605, 16.8943, 19.5497, 20.4988, 20.2761, 22.2939, 22.3475, 22.3945, 23.4008, 24.4749, 25.3336, 27.3485, 28.7082, 28.6709, 28.6709, 29.0704, 29.3028, 29.4161, 29.4331, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, 29.4232, null, null],implied:null},
  {aq:'2016Q3',pts:[0.0, 0.0432, 1.523, 3.0439, 5.8703, 10.4225, 11.9285, 14.8284, 16.5771, 18.3025, 19.0959, 19.7377, 24.4051, 25.5628, 26.3163, 26.9365, 28.3966, 29.2821, 29.9256, 30.4508, 30.7226, 31.0719, 31.1267, 31.2498, 31.2498, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, 31.209, null, null, null],implied:null},
  {aq:'2016Q4',pts:[0.0, 0.1008, 0.7233, 2.7282, 5.8815, 11.5784, 15.6294, 16.9188, 18.9006, 20.167, 22.025, 23.6728, 24.7724, 28.1933, 30.0148, 32.0157, 32.4462, 32.3669, 32.3415, 32.5417, 32.628, 32.5983, 32.7579, 32.7721, 32.72, 32.6723, 32.6706, 32.7314, 32.7765, 33.1278, 33.3441, 33.3321, 33.3299, 33.3295, 33.3273, 33.3273, 33.3256, 33.3241, 33.3222, 33.3217, null, null, null, null],implied:null},
  {aq:'2017Q1',pts:[0.0, 0.136, 3.7015, 6.477, 11.5908, 13.7693, 17.6598, 19.2348, 20.2356, 20.62, 24.2844, 25.0012, 25.9497, 27.9229, 29.1369, 29.6383, 29.7129, 30.448, 31.637, 31.7671, 32.3144, 32.411, 32.8257, 33.0724, 33.3552, 33.5775, 33.8986, 33.8789, 33.8633, 33.8633, 34.4796, 34.4795, 34.4789, 34.4789, 34.4789, 34.4789, 34.4789, 34.4789, 34.4781, null, null, null, null, null],implied:null},
  {aq:'2017Q2',pts:[0.0, 0.0558, 1.6574, 6.6, 12.3329, 16.759, 18.6838, 21.6479, 23.1659, 25.238, 27.7715, 30.1017, 33.5448, 36.9428, 39.0708, 40.1991, 40.8365, 42.021, 43.1579, 43.5531, 43.4366, 43.5454, 43.5926, 43.7011, 43.7217, 43.9368, 44.2624, 44.2882, 44.1173, 44.3134, 44.7699, 44.7699, 44.7692, 44.7608, 44.7603, 44.7603, 44.7592, 44.7592, null, null, null, null, null, null],implied:null},
  {aq:'2017Q3',pts:[0.0, 0.0515, 4.514, 7.7489, 11.2372, 13.4658, 16.1992, 17.6391, 19.4158, 21.0669, 22.7685, 27.4343, 28.9809, 30.2556, 31.4862, 31.8932, 32.6069, 32.7286, 32.4659, 33.73, 33.5824, 33.5917, 33.5444, 33.8238, 33.9445, 34.0216, 33.9899, 33.9817, 33.9817, 34.0874, 34.0662, 33.9894, 33.9874, 33.987, 33.9866, 33.9859, 33.9853, null, null, null, null, null, null, null],implied:null},
  {aq:'2017Q4',pts:[0.0, 0.1442, 3.9078, 7.2168, 9.4454, 11.6527, 13.4365, 16.5029, 18.2584, 20.2484, 23.6127, 24.1621, 26.1304, 26.6822, 27.7223, 28.7159, 29.9929, 30.7234, 31.8297, 32.1944, 32.3095, 32.7493, 32.8498, 33.1038, 32.8835, 32.5891, 32.5801, 32.5801, 32.7432, 32.6983, 32.6905, 32.6909, 32.6909, 32.6903, 32.6903, 32.9394, null, null, null, null, null, null, null, null],implied:null},
  {aq:'2018Q1',pts:[0.0, 0.1799, 4.984, 7.4998, 11.3385, 14.3112, 17.89, 20.4983, 23.7, 29.0096, 31.449, 33.5374, 35.5826, 36.7407, 38.1755, 38.97, 39.9256, 40.1306, 40.7401, 40.8718, 41.1314, 41.3496, 41.3664, 41.5184, 41.689, 41.8077, 42.0754, 42.0938, 42.1708, 42.525, 42.5824, 42.5824, 42.493, 42.493, 42.493, null, null, null, null, null, null, null, null, null],implied:null},
  {aq:'2018Q2',pts:[0.0, 0.6289, 5.4235, 8.7995, 11.8646, 14.8784, 18.3946, 24.3444, 30.4295, 33.9747, 38.3288, 39.6258, 40.3889, 42.2828, 43.5444, 45.1788, 45.7384, 46.0926, 46.4721, 46.9393, 46.9604, 47.1066, 47.1997, 47.2211, 47.2169, 47.4361, 47.4353, 47.4603, 47.4534, 47.613, 47.6125, 47.6115, 47.6115, 47.632, null, null, null, null, null, null, null, null, null, null],implied:null},
  {aq:'2018Q3',pts:[0.0, 0.425, 5.5841, 8.5587, 11.617, 14.5581, 18.9301, 25.5059, 28.4878, 32.7612, 35.8035, 36.6359, 38.207, 38.456, 39.2484, 40.8912, 41.2535, 41.5853, 41.6756, 42.3242, 42.7419, 42.5734, 42.5298, 42.5678, 42.5838, 42.5934, 42.6772, 42.6065, 42.6114, 42.6128, 42.6127, 42.6124, 42.6117, null, null, null, null, null, null, null, null, null, null, null],implied:null},
  {aq:'2018Q4',pts:[0.0, 0.4692, 5.7696, 9.5067, 12.2096, 22.4472, 29.2999, 34.0953, 36.7735, 38.8177, 40.8767, 42.9402, 44.7698, 46.8984, 48.4863, 49.8178, 49.7262, 50.2762, 50.4582, 50.5638, 51.1674, 51.1319, 51.4888, 51.7773, 52.1491, 52.181, 52.2126, 52.3044, 52.2155, 52.2083, 52.2078, 52.2073, null, null, null, null, null, null, null, null, null, null, null, null],implied:52.2163},
  {aq:'2019Q1',pts:[0.0, 0.5356, 8.014, 13.3097, 22.366, 27.8639, 33.1104, 36.7803, 39.6959, 41.3092, 43.9734, 45.1572, 46.6696, 47.7434, 49.9309, 50.8001, 51.4151, 51.8421, 52.257, 52.5191, 52.7863, 52.7415, 53.1402, 53.5001, 53.6, 53.6852, 53.8394, 53.8784, 53.8307, 53.8223, 53.8223, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:53.8971},
  {aq:'2019Q2',pts:[0.0, 0.2149, 6.3966, 11.5556, 19.2806, 25.2488, 28.9076, 32.7652, 35.6281, 39.1001, 41.394, 43.6065, 45.6102, 47.0901, 48.3306, 49.7997, 50.2221, 51.0537, 51.1998, 51.3894, 51.4826, 51.7421, 51.853, 51.9652, 51.9644, 51.9198, 51.8338, 51.8335, 51.8332, 51.8329, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:51.9479},
  {aq:'2019Q3',pts:[0.0, 0.4243, 6.2603, 11.2264, 16.7, 21.7794, 26.4641, 29.4794, 33.3543, 36.675, 40.7658, 43.4047, 44.8987, 46.7333, 47.9431, 48.8443, 49.5113, 50.4486, 51.0923, 51.2674, 51.1226, 51.5757, 51.6283, 51.6275, 51.7537, 51.7585, 51.7211, 51.7292, 51.662, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:51.8176},
  {aq:'2019Q4',pts:[0.0, 0.8458, 9.0966, 16.0282, 22.5207, 28.3115, 33.2531, 37.5062, 39.7611, 43.8158, 46.5777, 48.0282, 50.3907, 52.0798, 53.3539, 54.1609, 54.5562, 55.313, 55.8334, 56.1317, 56.4374, 56.5768, 56.6769, 56.8558, 56.9356, 56.9218, 56.9226, 56.9097, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:57.2452},
  {aq:'2020Q1',pts:[0.0, 0.7468, 10.3011, 17.1479, 28.4856, 34.7818, 41.1628, 44.0214, 49.4662, 51.7635, 54.4086, 56.3153, 58.635, 59.923, 60.7555, 61.662, 62.379, 62.8922, 63.5996, 64.039, 64.3321, 64.6015, 64.8141, 64.9568, 64.9696, 64.9992, 64.9989, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:65.5726},
  {aq:'2020Q2',pts:[0.0, 0.388, 8.1051, 11.2483, 14.0534, 16.7434, 19.2684, 21.1662, 25.5719, 27.7209, 32.1458, 33.5161, 33.9478, 34.2046, 34.6144, 35.0345, 36.6235, 37.7335, 37.7558, 37.7638, 38.2112, 38.1864, 38.187, 38.6157, 38.6219, 38.622, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:39.0549},
  {aq:'2020Q3',pts:[0.0, 2.7335, 13.4218, 15.1834, 17.1503, 20.6841, 25.3774, 27.6145, 30.5432, 34.0579, 35.8078, 36.7193, 37.4747, 38.4591, 38.4892, 38.5679, 38.8274, 39.689, 39.6485, 39.2885, 39.261, 39.261, 39.2616, 39.3092, 39.3092, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:39.7798},
  {aq:'2020Q4',pts:[0.0, 0.9112, 5.7654, 8.4042, 9.9896, 10.3614, 11.2634, 12.0117, 11.9725, 11.9288, 11.7992, 12.1586, 12.4476, 13.1157, 12.7852, 12.8866, 12.9231, 12.7686, 12.8892, 12.7588, 12.9412, 12.9125, 12.784, 12.784, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.8163},
  {aq:'2021Q1',pts:[0.0, 0.9936, 3.8819, 5.7066, 6.4356, 6.7225, 8.4489, 8.9467, 8.4433, 8.4888, 6.5764, 7.2751, 7.2777, 7.5806, 7.4817, 7.8078, 7.9498, 8.7865, 9.7419, 9.7419, 9.7419, 9.8102, 11.3662, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:11.4928},
  {aq:'2021Q2',pts:[0.0, 0.3008, 5.467, 7.6885, 8.2878, 8.1948, 9.5069, 10.1839, 10.1259, 10.6512, 11.3039, 11.4448, 11.2472, 11.6226, 11.7623, 11.9234, 12.3619, 12.403, 12.36, 12.4293, 12.4426, 12.4266, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.5898},
  {aq:'2021Q3',pts:[0.0, 0.1483, 4.0567, 4.753, 4.8265, 5.5115, 6.7001, 6.7848, 7.7545, 8.1993, 8.7282, 8.9864, 9.0883, 9.7727, 9.8607, 9.727, 10.7155, 10.7305, 11.246, 11.232, 12.613, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:12.8489},
  {aq:'2021Q4',pts:[0.0, 0.7223, 6.911, 10.4068, 11.5613, 13.0548, 13.7816, 16.0591, 16.7169, 17.3696, 16.7532, 16.9937, 17.6827, 17.7556, 17.7321, 18.3665, 18.0024, 17.9256, 17.8368, 17.732, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:18.4208},
  {aq:'2022Q1',pts:[0.0, 0.2886, 5.3806, 7.4009, 8.5503, 9.7089, 11.2761, 13.3055, 15.5216, 16.7954, 18.2609, 18.2131, 17.9582, 17.8975, 17.7586, 17.2621, 18.0119, 18.546, 18.5912, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:19.0736},
  {aq:'2022Q2',pts:[0.0, 0.644, 6.9979, 9.309, 9.7122, 12.5336, 12.7882, 13.1586, 13.3425, 14.0026, 14.045, 14.2037, 14.4083, 14.2841, 15.4651, 16.3571, 16.4202, 15.7751, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:16.5085},
  {aq:'2022Q3',pts:[0.0, 2.3042, 10.5415, 11.4829, 13.8398, 15.8401, 15.4425, 15.8265, 16.9912, 16.5622, 18.8153, 18.6234, 19.1601, 20.7824, 19.5038, 19.3885, 19.4229, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:20.9364},
  {aq:'2022Q4',pts:[0.0, 1.7437, 8.6091, 11.4772, 12.5298, 14.5419, 15.571, 15.4165, 16.6093, 17.0381, 17.7629, 18.3218, 18.7011, 19.4584, 19.245, 19.2808, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:21.3345},
  {aq:'2023Q1',pts:[0.0, 1.9093, 10.3022, 10.9942, 11.1535, 12.8596, 14.4277, 14.4313, 15.0456, 15.5725, 16.1714, 16.8895, 16.4143, 16.4314, 16.4196, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:18.3001},
  {aq:'2023Q2',pts:[0.0, 1.8253, 12.078, 15.4164, 17.4092, 18.8148, 20.1149, 20.6035, 21.6825, 22.0036, 22.5645, 22.6396, 23.0058, 23.1733, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:26.431},
  {aq:'2023Q3',pts:[0.0, 1.9981, 12.4148, 13.6748, 16.0867, 16.564, 17.5374, 17.9842, 18.2915, 19.4075, 19.7496, 19.9529, 20.1681, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:23.5292},
  {aq:'2023Q4',pts:[0.0, 2.7038, 11.9864, 14.9883, 17.3718, 18.5902, 19.8308, 20.2905, 20.9548, 22.142, 22.8442, 23.5998, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:27.7938},
  {aq:'2024Q1',pts:[0.0, 2.5749, 12.0843, 14.3241, 15.7711, 16.7774, 17.8983, 18.4152, 19.1883, 20.1234, 21.2141, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:25.3254},
  {aq:'2024Q2',pts:[0.0, 2.7833, 12.5346, 14.9854, 18.1544, 20.2464, 22.5363, 23.6138, 24.4476, 25.9017, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:31.6414},
  {aq:'2024Q3',pts:[0.0, 2.5095, 12.7056, 15.4738, 17.1609, 18.6975, 20.3962, 21.4035, 22.759, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:29.8766},
  {aq:'2024Q4',pts:[0.0, 2.3467, 13.189, 14.8081, 16.0816, 17.8685, 18.8618, 20.118, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:27.2104},
  {aq:'2025Q1',pts:[0.0, 4.1111, 14.4421, 15.5156, 16.2306, 17.6629, 18.4043, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:28.6447},
  {aq:'2025Q2',pts:[0.0, 3.5542, 15.4653, 17.2061, 18.0851, 19.5241, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:30.9933},
  {aq:'2025Q3',pts:[0.0, 3.5699, 15.4907, 17.0443, 18.6537, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:32.4234},
  {aq:'2025Q4',pts:[0.0, 3.7413, 18.265, 24.696, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:41.1398},
  {aq:'2026Q1',pts:[0.0, 2.8655, 14.9155, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:38.0298},
  {aq:'2026Q2',pts:[0.0, 3.1084, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],implied:40.9442},
];

const SEGMENTS = [
  {key:"APD",  label:"APD",         title:"APD — Loss Cost @ SIR",        cq:11.4981, hasExtra:true,  data:APD_DATA},
  {key:"DM",   label:"DM",          title:"DM — Loss Cost @ SIR",         cq:14.7179,  hasExtra:true,  data:DM_DATA},
  {key:"BI",   label:"BI Combined", title:"BI Combined — Loss Cost @ SIR", cq:null,  hasExtra:true,  data:BI_DATA},
  {key:"BIFL", label:"BI FL",       title:"BI FL — Loss Cost @ SIR",      cq:null, hasExtra:true,  data:BIFL_DATA},
  {key:"UM",   label:"UM SIR",      title:"UM — Loss Cost @ SIR",         cq:39.95,  hasExtra:true,  data:UM_DATA},
  {key:"UM250",label:"UM 250K",     title:"UM — Loss Cost @ 250K",        cq:null,     hasExtra:false, data:UM250_DATA},
];

function ChartPanel({seg, showEras, hoveredAQ, setHoveredAQ, selectedAQs, setSelectedAQs}){
  const lineData = useMemo(()=>buildLineData(seg.data),[seg.key]);
  const impliedPts = useMemo(()=>
    lineData.filter(r=>r.implied!==null).map(r=>({aq:r.aq,x:r.lastAge,y:r.implied,lc:r.implied,color:r.color}))
  ,[lineData]);

  // selectedAQs is a Set
  const selRows = useMemo(()=>
    lineData.filter(r=>selectedAQs.has(r.aq))
  ,[lineData,selectedAQs]);

  const anySelected = selectedAQs.size > 0;

  const yMax = useMemo(()=>{
    const vals=[...impliedPts.map(p=>p.lc),seg.cq??0];
    return Math.ceil(Math.max(...vals,5)/5)*5+5;
  },[impliedPts,seg.cq]);

  const toggleAQ = (aq) => {
    setSelectedAQs(prev => {
      const next = new Set(prev);
      if(next.has(aq)) next.delete(aq); else next.add(aq);
      return next;
    });
  };

  return (
    <div>
      {/* Main chart */}
      <div style={{background:"#13132a",borderRadius:10,padding:"12px 8px 6px",
        border:`1px solid ${anySelected?"#5a7df5":"#222"}`,transition:"border-color 0.2s",marginBottom:10}}>
        <ResponsiveContainer width="100%" height={420}>
          <ComposedChart margin={{top:8,right:42,bottom:28,left:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a"/>
            <XAxis dataKey="age" type="number" domain={[0,142]} tickCount={12}
              label={{value:"Development age (months)",position:"insideBottom",offset:-14,fill:"#555",fontSize:11}}
              tick={{fill:"#555",fontSize:10}} stroke="#333"/>
            <YAxis domain={[0,yMax]} tickCount={7}
              label={{value:"LC per 1K miles",angle:-90,position:"insideLeft",offset:10,fill:"#555",fontSize:11}}
              tick={{fill:"#555",fontSize:10}} stroke="#333"/>
            <Tooltip content={()=>null}/>
            {seg.cq&&<ReferenceLine y={seg.cq} stroke="#1D9E75" strokeDasharray="6 4" strokeWidth={2}
              label={{value:seg.cq.toFixed(2),position:"right",fill:"#1D9E75",fontSize:10,fontWeight:600}}/>}
            {lineData.map(r=>{
              if(!showEras[r.era])return null;
              const isHov=hoveredAQ===r.aq, isSel=selectedAQs.has(r.aq);
              const op=anySelected?(isSel?1:0.07):(hoveredAQ&&!isHov?0.1:isHov?1:0.6);
              return[
                <Line key={r.aq+"-l"} data={r.points} dataKey="lc" stroke={r.color}
                  strokeWidth={isSel?3:isHov?2.5:1} dot={false} strokeOpacity={op}
                  isAnimationActive={false} connectNulls={false}/>,
                r.implied!==null?<Line key={r.aq+"-c"}
                  data={[{age:r.lastAge,lc:r.implied},{age:140,lc:r.implied}]}
                  dataKey="lc" stroke={r.color} strokeWidth={isSel?2.5:1}
                  strokeDasharray="4 3" dot={false} strokeOpacity={op}
                  isAnimationActive={false} legendType="none"/>:null
              ];
            })}
            <Scatter data={impliedPts} fill="#e24b4a" shape={(props)=>{
              const{cx,cy,payload}=props;
              if(!cx||!cy)return null;
              const isHov=hoveredAQ===payload?.aq, isSel=selectedAQs.has(payload?.aq);
              const op=anySelected?(isSel?1:0.12):(hoveredAQ&&!isHov?0.15:1);
              return<circle cx={cx} cy={cy} r={isSel||isHov?7:5} fill="#e24b4a"
                stroke={isSel?"#fff":"#0f0f1a"} strokeWidth={isSel?2:1.5} opacity={op}
                style={{cursor:"pointer"}} onClick={()=>toggleAQ(payload.aq)}/>;
            }}/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Implied LC cards */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <p style={{fontSize:11,color:"#555",margin:0}}>
          Click cards or dots to select quarters for drill-down
          {anySelected&&<span style={{color:"#5a7df5",marginLeft:6}}>({selectedAQs.size} selected)</span>}
        </p>
        {anySelected&&(
          <button onClick={()=>setSelectedAQs(new Set())}
            style={{background:"none",border:"1px solid #444",color:"#888",borderRadius:4,
              padding:"2px 8px",cursor:"pointer",fontSize:10}}>
            Clear all
          </button>
        )}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:16}}>
        {impliedPts.filter(p=>showEras[getEra(p.aq)]).map(pt=>{
          const isSel=selectedAQs.has(pt.aq);
          return(
            <div key={pt.aq} onMouseEnter={()=>setHoveredAQ(pt.aq)} onMouseLeave={()=>setHoveredAQ(null)}
              onClick={()=>toggleAQ(pt.aq)}
              style={{background:isSel?"#1a1a3a":hoveredAQ===pt.aq?"#191930":"#13132a",
                border:`1px solid ${isSel?"#5a7df5":hoveredAQ===pt.aq?"#e24b4a":"#222"}`,
                borderRadius:5,padding:"4px 8px",cursor:"pointer",transition:"all 0.15s",
                boxShadow:isSel?"0 0 8px #5a7df544":"none"}}>
              <div style={{fontSize:10,color:isSel?"#5a7df5":"#777"}}>{pt.aq}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#e24b4a"}}>{pt.lc.toFixed(2)}</div>
            </div>
          );
        })}
        {seg.cq&&<div style={{background:"#0d2a1f",border:"1px solid #1D9E75",borderRadius:5,padding:"4px 8px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{fontSize:10,color:"#777"}}>CQ Sel</div>
          <div style={{fontSize:12,fontWeight:600,color:"#1D9E75"}}>{seg.cq.toFixed(2)}</div>
        </div>}
      </div>

      {/* Multi-quarter drill-down */}
      {selRows.length>0&&(
        <div style={{background:"#13132a",border:"1px solid #5a7df5",borderRadius:10,padding:"16px 18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <span style={{fontWeight:700,fontSize:15,color:"#5a7df5"}}>
              Drill-down — {selRows.length} quarter{selRows.length>1?"s":""} selected
            </span>
            <button onClick={()=>setSelectedAQs(new Set())}
              style={{background:"none",border:"1px solid #444",color:"#888",borderRadius:4,
                padding:"2px 10px",cursor:"pointer",fontSize:11}}>
              ✕ Close all
            </button>
          </div>

          {/* Combined overlay chart showing all selected quarters */}
          <div style={{background:"#0d0d1e",borderRadius:8,padding:"10px 4px 8px",border:"1px solid #1e1e3a",marginBottom:14}}>
            <p style={{fontSize:10,color:"#555",margin:"0 0 4px 12px"}}>Overlay comparison</p>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart margin={{top:8,right:30,bottom:24,left:8}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a"/>
                <XAxis dataKey="age" type="number" domain={[0,142]} tickCount={12}
                  label={{value:"Age (months)",position:"insideBottom",offset:-13,fill:"#444",fontSize:10}}
                  tick={{fill:"#444",fontSize:9}} stroke="#333"/>
                <YAxis domain={[0,Math.ceil(Math.max(...selRows.map(r=>Math.max(r.lastLC||0,r.implied||0)),seg.cq||0)*1.3/5)*5]}
                  tickCount={6} tick={{fill:"#444",fontSize:9}} stroke="#333"/>
                <Tooltip content={(props)=>{
                  if(!props.active||!props.payload?.length) return null;
                  return(
                    <div style={{background:"#1a1a2e",border:"1px solid #333",borderRadius:6,padding:"6px 10px",fontSize:11}}>
                      <div style={{color:"#888",marginBottom:3}}>Age: {props.label} mo</div>
                      {props.payload.map(p=>(
                        <div key={p.name} style={{color:p.stroke||p.color}}>{p.name}: {p.value?.toFixed(2)}</div>
                      ))}
                    </div>
                  );
                }}/>
                {seg.cq&&<ReferenceLine y={seg.cq} stroke="#1D9E75" strokeDasharray="6 4" strokeWidth={1.5}
                  label={{value:`CQ: ${seg.cq.toFixed(2)}`,position:"right",fill:"#1D9E75",fontSize:9}}/>}
                {selRows.map(r=>[
                  <Line key={r.aq+"-l"} data={r.points} dataKey="lc" name={r.aq}
                    stroke={r.color} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false}/>,
                  r.implied!==null?<Line key={r.aq+"-c"}
                    data={[{age:r.lastAge,lc:r.implied},{age:140,lc:r.implied}]}
                    dataKey="lc" stroke={r.color} strokeWidth={1.5} strokeDasharray="4 3"
                    dot={false} isAnimationActive={false} legendType="none"/>:null
                ])}
              </ComposedChart>
            </ResponsiveContainer>
            {/* Color legend for overlay */}
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px 14px",paddingLeft:12,marginTop:4}}>
              {selRows.map(r=>(
                <span key={r.aq} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}>
                  <span style={{width:16,height:2.5,borderRadius:2,background:r.color,display:"inline-block"}}/>
                  <span style={{color:r.color,fontWeight:600}}>{r.aq}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Per-quarter stat cards + individual mini charts */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:12}}>
            {selRows.map(r=>(
              <div key={r.aq} style={{background:"#0f0f1a",borderRadius:8,padding:"12px",border:`1px solid ${r.color}44`}}>
                {/* Quarter header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontWeight:700,fontSize:13,color:r.color}}>{r.aq}</span>
                  <button onClick={()=>toggleAQ(r.aq)}
                    style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:12,padding:"0 4px"}}>
                    ✕
                  </button>
                </div>
                {/* Stat row */}
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:6,marginBottom:10}}>
                  {[
                    {label:"Last Actual",val:r.lastLC,   color:r.color},
                    {label:"Implied",    val:r.implied,  color:"#e24b4a"},
                    ...(seg.hasExtra?[
                      {label:"Default",val:r.defaultLC,color:"#f4c542"},
                      {label:"Prior",  val:r.priorLC,  color:"#a78bfa"},
                    ]:[]),
                    ...(seg.cq?[{label:"CQ",val:seg.cq,color:"#1D9E75"}]:[]),
                  ].map(item=>(
                    <div key={item.label} style={{background:"#13132a",borderRadius:5,padding:"6px 8px",border:`1px solid ${item.color}33`}}>
                      <div style={{fontSize:9,color:"#666"}}>{item.label}</div>
                      <div style={{fontSize:13,fontWeight:700,color:item.color}}>
                        {item.val!=null?item.val.toFixed(2):"—"}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div style={{background:"#0d0d1e",borderRadius:6,padding:"6px 2px 2px",border:"1px solid #1e1e3a"}}>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart margin={{top:4,right:8,bottom:18,left:4}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e"/>
                      <XAxis dataKey="age" type="number" domain={[0,142]} tickCount={8}
                        tick={{fill:"#444",fontSize:8}} stroke="#222"/>
                      <YAxis domain={[0,Math.ceil(Math.max(r.lastLC||0,r.implied||0,...(seg.hasExtra?[r.defaultLC||0,r.priorLC||0]:[]),seg.cq||0)*1.35/5)*5]}
                        tickCount={4} tick={{fill:"#444",fontSize:8}} stroke="#222"/>
                      <Tooltip content={()=>null}/>
                      <Line data={r.points} dataKey="lc" stroke={r.color}
                        strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false}/>
                      {r.implied!==null&&<Line
                        data={[{age:r.lastAge,lc:r.implied},{age:140,lc:r.implied}]}
                        dataKey="lc" stroke={r.color} strokeWidth={1.2} strokeDasharray="4 3"
                        dot={false} isAnimationActive={false} legendType="none"/>}
                      {[
                        r.implied!==null?{val:r.implied,color:"#e24b4a",label:"Imp"}:null,
                        ...(seg.hasExtra?[
                          r.defaultLC!==null?{val:r.defaultLC,color:"#f4c542",label:"Def"}:null,
                          r.priorLC!==null?{val:r.priorLC,color:"#a78bfa",label:"Pri"}:null,
                        ]:[]),
                        seg.cq?{val:seg.cq,color:"#1D9E75",label:"CQ"}:null,
                      ].filter(Boolean).map((ref,i)=>{
                        const fracs=[0.18,0.42,0.66,0.88];
                        return(
                          <ReferenceLine key={ref.label} y={ref.val} stroke={ref.color}
                            strokeDasharray="4 3" strokeWidth={1.2}
                            label={(props)=>{
                              const{viewBox}=props;
                              if(!viewBox)return null;
                              const{x,width,y}=viewBox;
                              const lx=x+width*fracs[i%fracs.length];
                              return(
                                <g>
                                  <rect x={lx-1} y={y-13} width={70} height={11} rx={2} fill="#0d0d1e" opacity={0.9}/>
                                  <text x={lx+2} y={y-4} fill={ref.color} fontSize={8} fontWeight={700}>
                                    {ref.label}: {ref.val.toFixed(2)}
                                  </text>
                                </g>
                              );
                            }}/>
                        );
                      })}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard(){
  const [activeTab,setActiveTab]=useState("APD");
  const [showEras,setShowEras]=useState(Object.fromEntries(ERAS.map(e=>[e,true])));
  const [hoveredAQ,setHoveredAQ]=useState(null);
  const [selectedAQs,setSelectedAQs]=useState({APD:new Set(),DM:new Set(),BI:new Set(),BIFL:new Set(),UM:new Set(),UM250:new Set()});
  const setSel=(key,updater)=>setSelectedAQs(p=>({...p,[key]:updater(p[key])}));
  const seg=SEGMENTS.find(s=>s.key===activeTab);

  return(
    <div style={{background:"#0f0f1a",minHeight:"100vh",padding:"20px",fontFamily:"'Segoe UI',sans-serif",color:"#e0e0e0"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>

        {/* Header */}
        <div style={{marginBottom:14}}>
          <h1 style={{margin:0,fontSize:17,fontWeight:700,color:"#f0f0f0"}}>LC Development Triangle Dashboard</h1>
          <p style={{margin:"3px 0 0",fontSize:11,color:"#555"}}>Incurred LC per 1K miles · Development age (months)</p>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",gap:4,marginBottom:14}}>
          {SEGMENTS.map(s=>(
            <button key={s.key} onClick={()=>setActiveTab(s.key)}
              style={{padding:"7px 22px",borderRadius:7,border:"none",cursor:"pointer",
                fontWeight:600,fontSize:13,transition:"all 0.2s",
                background:activeTab===s.key?"#5a7df5":"#13132a",
                color:activeTab===s.key?"#fff":"#888",
                boxShadow:activeTab===s.key?"0 0 12px #5a7df544":"none",
                borderBottom:activeTab===s.key?"2px solid #5a7df5":"2px solid transparent"}}>
              {s.label}
              {s.cq&&<span style={{marginLeft:6,fontSize:10,opacity:0.8,fontWeight:400}}>
                CQ {s.cq.toFixed(2)}
              </span>}
            </button>
          ))}
        </div>

        {/* Era legend */}
        <div style={{background:"#13132a",borderRadius:8,padding:"10px 14px",marginBottom:14,border:"1px solid #1e1e3a"}}>
          <div style={{fontSize:10,color:"#555",marginBottom:6,letterSpacing:0.5}}>ERA TOGGLE</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px 10px",alignItems:"center"}}>
            {ERAS.map(era=>(
              <button key={era} onClick={()=>setShowEras(p=>({...p,[era]:!p[era]}))}
                style={{display:"flex",alignItems:"center",gap:4,
                  background:showEras[era]?"rgba(255,255,255,0.06)":"transparent",
                  border:"none",cursor:"pointer",padding:"2px 7px",borderRadius:4,
                  color:showEras[era]?"#ddd":"#444",fontSize:10}}>
                <span style={{width:18,height:2,borderRadius:2,background:showEras[era]?ERA_COLORS[era]:"#333",display:"inline-block"}}/>
                {era}
              </button>
            ))}
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#e24b4a",padding:"2px 7px"}}>
              <span style={{width:12,borderTop:"2px dashed #888",display:"inline-block"}}/>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#e24b4a",display:"inline-block"}}/>
              Implied LC
            </span>
            {seg.cq&&<span style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#1D9E75",padding:"2px 7px"}}>
              <span style={{width:18,borderTop:"2px dashed #1D9E75",display:"inline-block"}}/>
              CQ Selection
            </span>}
          </div>
        </div>

        {/* Active chart */}
        <ChartPanel key={activeTab} seg={seg}
          showEras={showEras}
          hoveredAQ={hoveredAQ} setHoveredAQ={setHoveredAQ}
          selectedAQs={selectedAQs[activeTab]}
          setSelectedAQs={(updater)=>setSel(activeTab,updater)}/>

      </div>
    </div>
  );
}
