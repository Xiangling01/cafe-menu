"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [menuName, setMenuName] = useState("");
  const [price, setPrice] = useState("");

  const [menus, setMenus] = useState<
    { id: number; menu_name: string; price: number }[]
  >([]);
  

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setMenus(data || []);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const addMenu = async () => {
    if (!menuName || !price) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    const { error } = await supabase
      .from("menu")
      .insert([
        {
          menu_name: menuName,
          price: Number(price),
        },
      ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    await fetchMenus();

    alert("บันทึกสำเร็จ");

    setMenuName("");
    setPrice("");
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        ☕ Cafe Menu
      </h1>

      <div className="mt-6 space-y-3">
        <input
          type="text"
          placeholder="ชื่อเมนู"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="border p-2 block"
        />

        <input
          type="number"
          placeholder="ราคา"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 block"
        />

        <button
          onClick={addMenu}
          className="bg-black text-white px-4 py-2"
        >
          เพิ่มเมนู
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">
          รายการเมนู
        </h2>

        {menus.map((menu) => (
          <div key={menu.id}>
            {menu.menu_name} - {menu.price} บาท
          </div>
        ))}
      </div>
    </main>
  );
}