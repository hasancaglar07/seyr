"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";

const initial = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");

    try {
      const response = await fetch("/api/v1/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Mesaj gonderilemedi.");
      }

      setState("sent");
      setForm(initial);
    } catch {
      setState("error");
    }
  };

  return (
    <form className="contact-form grid gap-5" onSubmit={submit}>
      <label className="grid gap-2 text-sm font-medium text-[color:rgba(15,23,42,0.68)]">
        Ad Soyad
        <Input
          required
          value={form.fullName}
          onChange={(event) => setForm((old) => ({ ...old, fullName: event.target.value }))}
          placeholder="Adiniz Soyadiniz"
          className="h-11 rounded-[0.8rem] border-white/55 bg-[color:rgba(255,255,255,0.3)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[color:rgba(15,23,42,0.68)]">
        E-posta
        <Input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm((old) => ({ ...old, email: event.target.value }))}
          placeholder="iletisim@ornek.com"
          className="h-11 rounded-[0.8rem] border-white/55 bg-[color:rgba(255,255,255,0.3)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[color:rgba(15,23,42,0.68)]">
        Konu
        <Input
          required
          value={form.subject}
          onChange={(event) => setForm((old) => ({ ...old, subject: event.target.value }))}
          placeholder="Mesajinizin konusu"
          className="h-11 rounded-[0.8rem] border-white/55 bg-[color:rgba(255,255,255,0.3)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-[color:rgba(15,23,42,0.68)]">
        Mesaj
        <Textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm((old) => ({ ...old, message: event.target.value }))}
          placeholder="Mesajinizi yazin"
          className="min-h-32 rounded-[0.8rem] border-white/55 bg-[color:rgba(255,255,255,0.3)]"
        />
      </label>
      <Button type="submit" disabled={state === "sending"} className="h-10 w-fit min-w-44 justify-center rounded-full border border-[color:rgba(14,165,233,0.25)] bg-[color:rgba(255,255,255,0.56)] px-6 text-[color:rgba(15,23,42,0.85)] shadow-[0_8px_24px_rgba(14,165,233,0.2)]">
        {state === "sending" ? "Gonderiliyor..." : "Mesaji Gonder"}
      </Button>
      {state === "sent" ? <p className="ok text-sm">Mesajiniz alindi. En kisa surede donus saglanacak.</p> : null}
      {state === "error" ? <p className="err text-sm">Mesaj gonderilemedi. Lutfen tekrar deneyin.</p> : null}
    </form>
  );
}
