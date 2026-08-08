"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2, FiEye, FiEyeOff, FiStar } from "react-icons/fi";

interface Props {
  id: string;
  name: string;
  category: string;
  published: boolean;
  featured: boolean;
}

export default function IndicatorRow({ id, name, category, published, featured }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await fetch(`/api/indicators/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/indicators/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className={busy ? "opacity-50" : ""}>
      <td className="px-5 py-3.5 text-text">{name}</td>
      <td className="px-5 py-3.5 text-text-dim">{category}</td>
      <td className="px-5 py-3.5">
        <button onClick={() => patch({ published: !published })} className="text-text-dim hover:text-text" title="Toggle published">
          {published ? <FiEye size={15} className="text-green" /> : <FiEyeOff size={15} />}
        </button>
      </td>
      <td className="px-5 py-3.5">
        <button onClick={() => patch({ featured: !featured })} className="text-text-dim hover:text-amber" title="Toggle featured">
          <FiStar size={15} className={featured ? "text-amber fill-current" : ""} />
        </button>
      </td>
      <td className="px-5 py-3.5">
        <button onClick={remove} className="text-text-dim hover:text-red" title="Delete">
          <FiTrash2 size={15} />
        </button>
      </td>
    </tr>
  );
}
