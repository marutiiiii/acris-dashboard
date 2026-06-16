import { useEffect, useRef, useState } from "react";
import { Bell, Search, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/state/ThemeContext";
import { useCopilot, CopilotMode } from "@/state/CopilotContext";
import { useAuth } from "@/state/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const MODES: { value: CopilotMode; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "expert", label: "Expert" },
];

export default function TopBar() {
  const { theme, toggle } = useTheme();
  const { mode, setMode } = useCopilot();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const name = user?.user_metadata?.name ?? user?.email ?? "Aarav Mehta";
  const role = user?.user_metadata?.role ?? "Compliance Officer";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || name.slice(0, 2).toUpperCase();

  const isRegulationsPage = location.pathname === "/regulations";

  useEffect(() => {
    if (isRegulationsPage) {
      setSearchValue(searchParams.get("q") || "");
    } else {
      setSearchValue("");
    }
  }, [location.pathname, searchParams, isRegulationsPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (isRegulationsPage) {
      if (val) {
        setSearchParams({ q: val });
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        setSearchParams(params);
      }
    }
  };

  const handleSearchFocus = () => {
    if (!isRegulationsPage) {
      toast({
        title: "Search Feature",
        description: "Search filters are coming soon for this page! Try search on the Regulations page.",
      });
    }
  };

  return (
    <header className="h-14 border-b border-slate-800/40 bg-[#070d1e] flex items-center justify-between px-6 flex-shrink-0 select-none">
      {/* Search Input */}
      <div className="flex items-center gap-2.5 text-slate-400 bg-[#0c142b]/60 border border-slate-800/40 rounded-lg px-3 h-9 w-80">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search regulations, MAPs, documents..."
          className="border-0 bg-transparent text-xs flex-1 placeholder:text-slate-500/80 focus:outline-none text-white"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleSearchFocus}
        />
        <kbd className="hidden sm:inline text-[9px] font-bold text-slate-500/80 border border-slate-800/50 px-1.5 py-0.5 rounded bg-slate-900">⌘K</kbd>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4 text-xs">
        {/* Mode Toggler */}
        <div className="flex items-center gap-0.5 bg-[#0c142b]/80 border border-slate-800/40 rounded-lg p-0.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                mode === m.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggle} 
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-800/40 transition-all" 
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-800/40 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center rounded-full">3</span>
        </button>

        <div className="w-px h-6 bg-slate-800/40" />

        {/* User Block */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-xs font-bold rounded-lg shadow-lg shadow-blue-500/15 border border-blue-500/25">
            {initials}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">{name}</div>
            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{role}</div>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="ml-1 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

