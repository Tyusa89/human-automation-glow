"use client";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { 
        e.preventDefault(); 
        setOpen(o => !o); 
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  
  const nav = (href: string) => { 
    navigate(href); 
    setOpen(false); 
  };
  
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Go to…" />
      <CommandList>
        <CommandGroup heading="Navigation">
          {[
            { label: "Home", href: "/" },
            { label: "Product", href: "/product" },
            { label: "Solutions", href: "/solutions" },
            { label: "Templates", href: "/templates" },
            { label: "Integrations", href: "/integrations" },
            { label: "Pricing", href: "/pricing" },
            { label: "Docs", href: "/docs" },
            { label: "Trust & Security", href: "/trust" },
            { label: "Contact", href: "/contact" },
          ].map(i => (
            <CommandItem key={i.href} onSelect={() => nav(i.href)}>
              {i.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}