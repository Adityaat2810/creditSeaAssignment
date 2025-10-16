interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "upload", label: "Upload" },
    { id: "reports", label: "Reports" }
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};