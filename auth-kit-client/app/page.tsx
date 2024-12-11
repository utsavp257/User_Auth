"use client";

import { useUserContext } from "@/context/userContext";

export default function Home() {
  // const user = useUserContext();
  // console.log(user);
  const name = "ronaldoooo";
  const { logoutUser } = useUserContext();
  return (
    <main className="py-[2rem] mx-[2rem]">
      <header className="flex items-center justify-center">
        <h1 className="text-[2rem]">
          Hey there, <span className="text-red-600"> {name} </span> Welcome to your current next.js app. 
        </h1>
        <div className="flex items-center gap-4">
          <img src="" alt="" />
          <button onClick={logoutUser} className="px-4 py-2 bg-red-600 text-white rounded-md">
            Logout   
          </button>
        </div>
      </header>
    </main>
  );
}
