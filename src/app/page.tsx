"use client"
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl py-20 flex gap-4 mx-auto">
        <Button id="get" onClick={() => alert("get")}>GET</Button>
        <Button id="create" variant="success" onClick={() => alert("create")}>CREATE</Button>
        <Button id="update" variant="secondary" onClick={() => alert("update")}>UPDATE</Button>
        <Button id="delete" variant="danger" onClick={() => alert("delete")}>DELETE</Button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-slate-500">@copyright</p>
      </footer>
    </div>
  );
}
