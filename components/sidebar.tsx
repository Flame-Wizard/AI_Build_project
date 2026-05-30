"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Search,
  Database,
  Layers,
  Activity,
  Menu,
  X,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Forecasts", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Database, label: "Data Sources", active: false },
  { icon: Layers, label: "Integrations", active: false },
  { icon: Activity, label: "Real-time", active: false },
]

const bottomItems = [
  { icon: Bell, label: "Notifications", badge: 3 },
  { icon: HelpCircle, label: "Help Center" },
  { icon: Settings, label: "Settings" },
]

export function Sidebar({ 
  activeTab, 
  setActiveTab,
  isCollapsed,
  setIsCollapsed
}: { 
  activeTab: string
  setActiveTab: (tab: string) => void 
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(true)

  const sidebarWidth = isCollapsed ? "w-16" : "w-64"

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full",
          "lg:w-auto"
        )}
        style={{ width: isCollapsed ? 64 : 256 }}
      >
        {/* Logo + Collapse Toggle */}
        <div className={cn(
          "relative flex h-14 items-center px-3 mb-2",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary"
              >
                <BarChart3 className="h-4 w-4 text-foreground" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-semibold tracking-tight text-foreground overflow-hidden whitespace-nowrap"
              >
                DataBox
              </motion.span>
            </div>
          )}
          
          {/* Desktop Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex shrink-0 h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          
          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search - only show when not collapsed */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative px-3 py-2 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search...</span>
                <kbd className="ml-auto rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  /
                </kbd>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Main Items */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-2">
          {!isCollapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Main Menu
            </p>
          )}
          <ul className="space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
              { icon: TrendingUp, label: "Forecasts", id: "forecasts" },
              { icon: BarChart3, label: "Analytics", id: "analytics" },
              { icon: Database, label: "Data Sources", id: "data" },
              { icon: Layers, label: "Integrations", id: "integrations" },
              { icon: Activity, label: "Real-time", id: "pipeline" },
            ].map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                >
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-foreground")} />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground"
                          />
                        )}
                      </>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>

          {/* Bottom Nav Items */}
          <div className="mt-4 border-t border-border pt-4">
            {!isCollapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Settings
              </p>
            )}
            <ul className="space-y-1">
              {bottomItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                >
                  <button 
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Collapsible Upgrade Card - only show when not collapsed */}
        <AnimatePresence>
          {showUpgrade && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative mx-3 mb-2 overflow-hidden"
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-3">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Sparkles className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-foreground">Upgrade to Pro</h4>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                      Advanced forecasting
                    </p>
                  </div>
                </div>
                <button className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-secondary py-1.5 text-[11px] font-medium text-foreground transition-all hover:bg-accent">
                  Learn More
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="relative border-t border-border p-3"
        >
          <div className={cn(
            "flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-secondary",
            isCollapsed && "justify-center p-0"
          )}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground ring-1 ring-border">
              JD
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">John Doe</p>
                <p className="truncate text-[10px] text-muted-foreground">john@databox.io</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.aside>
    </>
  )
}
