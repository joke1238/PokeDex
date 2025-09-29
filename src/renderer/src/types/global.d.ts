// global.d.ts
interface BossData {
  time: { cn: string };
  boss: { cn: string };
}

// 给 window.api 声明类型
interface Window {
  api: {
    getBossData: () => Promise<BossData[]>;
  };
}
