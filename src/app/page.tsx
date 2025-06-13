import Image from "next/image";

// 强制使用 SSR - 每次请求都在服务器端渲染
export const dynamic = 'force-dynamic';

// 在 App Router 中，我们直接在组件中进行异步数据获取
async function getServerTime() {
  // 这里可以添加任何服务器端的数据获取逻辑
  return new Date().toLocaleString();
}

export default async function Home() {
  // 在服务器端获取时间 - 每次请求都会重新获取
  const currentTime = await getServerTime();
  const renderMode = 'Server-Side Rendering (SSR)';
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-sm text-gray-500">
          <div>Render Mode: {renderMode}</div>
          <div>Last updated: {currentTime}</div>
        </div>
        <h1>On Sale</h1>
        <p>Good News - The Platinum Martin Standard Series D-28 Dreadnought Acoustic Guitar Natural has just dropped in price!</p>
        <p><button id="ViewProductButton" type="button" value="GuitarCenterApp://ProductDetailsPage?ID=site5127474188253093646">View Product</button></p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
