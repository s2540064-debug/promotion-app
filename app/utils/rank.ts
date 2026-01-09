// Rank definitions (in promotion order)
export const RANKS = [
  "新人",
  "主任",
  "係長",
  "課長",
  "部長",
  "役員",
  "社長",
  "会長",
] as const;

export type Rank = (typeof RANKS)[number];

// Rank calculation criteria (based on total score of posts and respects)
// Score = post count * 1 + respect count * 2
export function calculateRank(
  postCount: number,
  respectCount: number
): Rank {
  const score = postCount * 1 + respectCount * 2;

  if (score >= 20000) return "会長";
  if (score >= 5000) return "社長";
  if (score >= 2000) return "役員";
  if (score >= 500) return "部長";
  if (score >= 150) return "課長";
  if (score >= 50) return "係長";
  if (score >= 10) return "主任";
  return "新人";
}

// Rank style definitions
export function getRankStyle(rank: Rank): string {
  const baseStyle = "px-3 py-1 rounded-full text-xs font-bold";
  
  // Manager and above use champagne gold and silver for luxury feel
  switch (rank) {
    case "会長":
      return `${baseStyle} bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-yellow-500/50`;
    case "社長":
      return `${baseStyle} bg-gradient-to-r from-[#FFD700] to-[#FFC700] text-black shadow-md shadow-yellow-500/40`;
    case "役員":
      return `${baseStyle} bg-gradient-to-r from-[#C0C0C0] to-[#E8E8E8] text-black shadow-md shadow-gray-400/40`;
    case "部長":
      return `${baseStyle} bg-gradient-to-r from-[#FFD700] to-[#FFE44D] text-black shadow-sm shadow-yellow-500/30`;
    case "課長":
      return `${baseStyle} bg-blue-600 text-white`;
    case "係長":
      return `${baseStyle} bg-green-600 text-white`;
    case "主任":
      return `${baseStyle} bg-purple-600 text-white`;
    case "新人":
      return `${baseStyle} bg-gray-600 text-white`;
    default:
      return `${baseStyle} bg-gray-600 text-white`;
  }
}

