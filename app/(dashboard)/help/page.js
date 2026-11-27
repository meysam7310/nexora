"use client";

import { useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Search,
  BookOpen,
  MessageCircle,
  FolderKanban,
  Settings,
  CreditCard,
  Users,
  ChevronDown,
  ArrowUpRight,
  Clock3,
  FileText,
  LifeBuoy,
  Headphones,
  CircleHelp,
  X,
  SearchX,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

// Categories

const categories = [
  { id: "all", label: "All topics", icon: BookOpen, count: 12 },
  { id: "getting-started", label: "Getting Started", icon: Zap, count: 3 },
  { id: "projects", label: "Projects & Tasks", icon: FolderKanban, count: 3 },
  { id: "team", label: "Team Management", icon: Users, count: 2 },
  { id: "finance", label: "Finance", icon: CreditCard, count: 2 },
  { id: "account", label: "Account & Settings", icon: Settings, count: 2 },
];

// Help Articles

const articles = [
  {
    id: 1,
    category: "getting-started",
    title: "Getting started with Nexora",
    description:
      "Learn how to set up your workspace and get familiar with the main dashboard.",
    readTime: "4 min read",
    icon: Zap,
    color: "#635BFF",
    bg: "#635BFF14",
    tag: "Popular",
  },
  {
    id: 2,
    category: "getting-started",
    title: "Understanding your dashboard",
    description:
      "Explore your business overview, recent activities and performance metrics.",
    readTime: "5 min read",
    icon: FolderKanban,
    color: "#0D9488",
    bg: "#0D948814",
  },
  {
    id: 3,
    category: "getting-started",
    title: "Customizing your workspace",
    description:
      "Personalize your workspace, appearance and application preferences.",
    readTime: "3 min read",
    icon: Settings,
    color: "#D97706",
    bg: "#D9770614",
  },
  {
    id: 4,
    category: "projects",
    title: "Creating and managing projects",
    description:
      "Create projects, assign clients, set budgets and track project progress.",
    readTime: "6 min read",
    icon: FolderKanban,
    color: "#635BFF",
    bg: "#635BFF14",
    tag: "Essential",
  },
  {
    id: 5,
    category: "projects",
    title: "Managing tasks and deadlines",
    description:
      "Organize tasks, set priorities and keep track of upcoming deadlines.",
    readTime: "5 min read",
    icon: Clock3,
    color: "#EA580C",
    bg: "#EA580C14",
  },
  {
    id: 6,
    category: "projects",
    title: "Understanding project reports",
    description:
      "Use reports to understand project performance and business progress.",
    readTime: "4 min read",
    icon: FileText,
    color: "#0891B2",
    bg: "#0891B214",
  },
  {
    id: 7,
    category: "team",
    title: "Adding and managing team members",
    description:
      "Organize your team, manage member details and keep information updated.",
    readTime: "4 min read",
    icon: Users,
    color: "#0D9488",
    bg: "#0D948814",
  },
  {
    id: 8,
    category: "team",
    title: "Understanding team roles",
    description:
      "Learn how team roles and departments help organize your workspace.",
    readTime: "3 min read",
    icon: ShieldCheck,
    color: "#7C3AED",
    bg: "#7C3AED14",
  },
  {
    id: 9,
    category: "finance",
    title: "Tracking income and expenses",
    description:
      "Record transactions, organize expenses and monitor your financial activity.",
    readTime: "5 min read",
    icon: CreditCard,
    color: "#16A34A",
    bg: "#16A34A14",
  },
  {
    id: 10,
    category: "finance",
    title: "Managing your monthly budget",
    description:
      "Set a monthly budget and understand how your spending compares to it.",
    readTime: "4 min read",
    icon: FileText,
    color: "#D97706",
    bg: "#D9770614",
  },
  {
    id: 11,
    category: "account",
    title: "Changing your application language",
    description:
      "Choose your preferred language and customize the appearance of Nexora.",
    readTime: "2 min read",
    icon: Settings,
    color: "#635BFF",
    bg: "#635BFF14",
  },
  {
    id: 12,
    category: "account",
    title: "Managing your account preferences",
    description:
      "Explore notification preferences, profile settings and workspace options.",
    readTime: "3 min read",
    icon: ShieldCheck,
    color: "#0891B2",
    bg: "#0891B214",
  },
];

// FAQ

const faqs = [
  {
    question: "How do I create my first project?",
    answer:
      "Open the Projects section from the sidebar and select the New Project button. Enter your project name, choose a client, set a budget and provide a due date. Save your changes to create your project.",
    category: "Projects",
  },
  {
    question: "Can I manage multiple clients?",
    answer:
      "Yes. The Customers section lets you organize your clients, manage their contact information and review their associated projects and activity.",
    category: "Customers",
  },
  {
    question: "How can I change the application language?",
    answer:
      "Open Settings, navigate to Appearance and select your preferred language. Save your settings to apply your selection.",
    category: "Settings",
  },
  {
    question: "How do I track my income and expenses?",
    answer:
      "Visit the Finance section to create income and expense transactions, review your financial activity and manage your monthly budget.",
    category: "Finance",
  },
  {
    question: "Can I edit a task after creating it?",
    answer:
      "Yes. Open Tasks, select the task you want to update and use the edit option to change its title, description, priority, status or due date.",
    category: "Tasks",
  },
  {
    question: "Where can I see my business performance?",
    answer:
      "The Reports page provides an overview of your projects, revenue, clients and other business performance metrics.",
    category: "Reports",
  },
];

// Section Heading

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#635BFF]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

// Help Center Page

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState(faqs[0]?.question || "");
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const searchInputRef = useRef(null);

  // Navigation

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const focusSearch = () => {
    const hero = document.getElementById("help-hero");

    hero?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    searchInputRef.current?.focus({
      preventScroll: true,
    });
  };

  // Search

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedArticle(null);
    setActiveFaq(faqs[0]?.question || "");
    setShowAllFaqs(Boolean(value.trim()));
  };

  const clearSearch = () => {
    setSearch("");
    setActiveCategory("all");
    setSelectedArticle(null);
    setActiveFaq(faqs[0]?.question || "");
    setShowAllFaqs(false);
  };

  // Filter Articles

  const filteredArticles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "all" || article.category === activeCategory;

      const categoryLabel =
        categories.find((category) => category.id === article.category)
          ?.label || "";

      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        categoryLabel.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // Filter FAQs

  const filteredFaqs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return faqs.filter(
      (faq) =>
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
  }, [search]);

  const displayedFaqs =
    search.trim() || showAllFaqs ? filteredFaqs : filteredFaqs.slice(0, 4);

  // Search Submit

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (
      search.trim() &&
      filteredArticles.length === 0 &&
      filteredFaqs.length > 0
    ) {
      scrollToSection("help-faq");
      return;
    }

    scrollToSection("help-guides");
  };

  // FAQ Actions

  const toggleFaq = (question) => {
    setActiveFaq((current) => (current === question ? "" : question));
  };

  const exploreFaqs = () => {
    setSearch("");
    setActiveCategory("all");
    setActiveFaq(faqs[0]?.question || "");
    setShowAllFaqs(true);
    setSelectedArticle(null);

    requestAnimationFrame(() => {
      scrollToSection("help-faq");
    });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-8 pb-10">
        {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-medium text-[#635BFF]">Help Center</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Help Center
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Everything you need to get the most out of Nexora.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
            <LifeBuoy size={17} className="text-[#635BFF]" />

            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              Help & Support
            </span>
          </div>
        </div>

        {/* Hero Search */}

        <section
          id="help-hero"
          className="relative scroll-mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#29245f] via-[#4337a8] to-[#635BFF] px-5 py-10 sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl" />

          <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white">
              <img src="/nexora.webp" className="w-4" alt="Nexora" />
              NEXORA KNOWLEDGE CENTER
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
              How can we help you?
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-indigo-100/80">
              Search our guides, discover helpful resources and find answers to
              your questions.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-7 flex w-full min-w-0 max-w-xl items-center gap-2 rounded-2xl border border-white/20 bg-white p-2 shadow-xl shadow-black/10"
            >
              <Search size={19} className="ml-2 shrink-0 text-gray-400" />

              <input
                ref={searchInputRef}
                id="help-search"
                type="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for articles, topics or questions..."
                className="h-10 min-w-0 w-full flex-1 bg-transparent px-1 text-sm text-gray-800 outline-none placeholder:text-gray-400"
                aria-label="Search help articles and questions"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#635BFF] px-3 text-xs font-semibold text-white transition hover:bg-[#5148e5] sm:px-5"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-indigo-100/70">
              <span>Popular searches:</span>

              {["Projects", "Tasks", "Settings", "Finance"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    handleSearch(item);

                    requestAnimationFrame(() => {
                      scrollToSection("help-guides");
                    });
                  }}
                  className="rounded-full border border-white/15 px-2.5 py-1 transition hover:bg-white/15 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}

        <section>
          <SectionHeading
            eyebrow="Explore resources"
            title="Browse by category"
            description="Find helpful information organized by topic."
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedArticle(null);
                  }}
                  className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                    active
                      ? "border-[#635BFF] bg-[#635BFF]/[0.06] shadow-sm shadow-[#635BFF]/10"
                      : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-[#635BFF]/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-[#635BFF] text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-[#635BFF]/10 group-hover:text-[#635BFF] dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    {category.label}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">
                      {category.count} articles
                    </span>

                    <ArrowUpRight
                      size={14}
                      className={`transition ${
                        active
                          ? "text-[#635BFF]"
                          : "text-gray-300 group-hover:text-[#635BFF]"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Guides */}

        <section id="help-guides" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Knowledge base"
            title="Helpful guides"
            description={
              search
                ? `${filteredArticles.length} matching articles found`
                : "Step-by-step resources to help you work smarter."
            }
            action={
              <span className="text-xs font-medium text-gray-400">
                {filteredArticles.length} articles
              </span>
            }
          />

          {selectedArticle ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#635BFF] hover:underline"
              >
                <ArrowRight size={15} className="rotate-180" />
                Back to articles
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: selectedArticle.bg }}
                >
                  {(() => {
                    const ArticleIcon = selectedArticle.icon;

                    return (
                      <ArticleIcon
                        size={23}
                        style={{ color: selectedArticle.color }}
                      />
                    );
                  })()}
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#635BFF]">
                    Help article
                  </span>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-600 dark:text-gray-300">
                {selectedArticle.description}
              </p>

              <div className="mt-6 rounded-xl bg-gray-50 p-5 dark:bg-gray-800/60">
                <h4 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
                  Getting started
                </h4>

                <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                  To get started, open the relevant section from your Nexora
                  sidebar. Explore the available options, enter the required
                  information and save your changes. You can return to this
                  section at any time to review or update your information.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                <Clock3 size={14} />
                {selectedArticle.readTime}
              </div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredArticles.map((article) => {
                const Icon = article.icon;

                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#635BFF]/40 hover:shadow-lg hover:shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:shadow-black/20"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: article.bg }}
                      >
                        <Icon size={21} style={{ color: article.color }} />
                      </div>

                      {article.tag && (
                        <span className="rounded-full bg-[#635BFF]/10 px-2.5 py-1 text-[9px] font-bold text-[#635BFF]">
                          {article.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 transition group-hover:text-[#635BFF] dark:text-white">
                      {article.title}
                    </h3>

                    <p className="mt-2 min-h-[42px] text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {article.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                      <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Clock3 size={12} />
                        {article.readTime}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#635BFF]">
                        Read guide
                        <ArrowUpRight
                          size={13}
                          className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 py-14 text-center dark:border-gray-700">
              <SearchX size={30} className="mx-auto text-gray-300" />

              <h3 className="mt-4 text-sm font-bold text-gray-800 dark:text-white">
                No articles found
              </h3>

              <p className="mt-2 text-xs text-gray-500">
                Try another search or choose a different category.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* FAQ */}

        <section id="help-faq" className="scroll-mt-6">
          <SectionHeading
            eyebrow="Quick answers"
            title="Frequently asked questions"
            description="Answers to the questions users ask most often."
            action={
              <span className="rounded-lg bg-gray-100 px-3 py-2 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                {filteredFaqs.length} questions
              </span>
            }
          />

          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-2">
              {displayedFaqs.length > 0 ? (
                displayedFaqs.map((faq) => {
                  const isOpen = activeFaq === faq.question;

                  return (
                    <div
                      key={faq.question}
                      className={`overflow-hidden rounded-xl border transition ${
                        isOpen
                          ? "border-[#635BFF]/30 bg-[#635BFF]/[0.025]"
                          : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.question)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <CircleHelp
                            size={17}
                            className={
                              isOpen
                                ? "shrink-0 text-[#635BFF]"
                                : "shrink-0 text-gray-400"
                            }
                          />

                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                            {faq.question}
                          </span>
                        </div>

                        <ChevronDown
                          size={17}
                          className={`shrink-0 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180 text-[#635BFF]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
                          <p className="pl-7 text-xs leading-6 text-gray-500 dark:text-gray-400">
                            {faq.answer}
                          </p>

                          <span className="ml-7 mt-3 inline-block rounded-md bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-500 dark:bg-gray-800">
                            {faq.category}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                  <SearchX size={24} className="mx-auto text-gray-300" />

                  <p className="mt-3 text-xs text-gray-500">
                    No matching questions found.
                  </p>
                </div>
              )}

              {filteredFaqs.length > 4 && !search.trim() && (
                <button
                  type="button"
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="mt-2 flex items-center gap-2 text-xs font-bold text-[#635BFF] hover:underline"
                >
                  {showAllFaqs ? "Show less" : "View all questions"}
                  <ArrowUpRight size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
                  <MessageCircle size={21} />
                </div>

                <h3 className="mt-5 text-base font-bold text-gray-900 dark:text-white">
                  Still have questions?
                </h3>

                <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Can't find the answer you're looking for? Explore our guides
                  or get in touch with the support team.
                </p>
              </div>

              <div className="mt-7 space-y-2">
                <button
                  type="button"
                  onClick={exploreFaqs}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#635BFF] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#5148e5]"
                >
                  Explore FAQs
                  <ArrowUpRight size={14} />
                </button>

                <p className="text-center text-[10px] text-gray-400">
                  We're here to help you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Banner */}

        <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#635BFF]/[0.06] blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF]">
                <Headphones size={24} />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#635BFF]">
                  PERSONAL SUPPORT
                </span>

                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  Need a helping hand?
                </h3>

                <p className="mt-2 max-w-lg text-xs leading-6 text-gray-500 dark:text-gray-400">
                  Our support resources are here to help you get the best
                  experience out of your Nexora workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => scrollToSection("help-guides")}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#635BFF] hover:text-[#635BFF] dark:border-gray-700 dark:text-gray-200"
              >
                <BookOpen size={15} />
                Browse guides
              </button>

              <button
                type="button"
                onClick={focusSearch}
                className="flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5148e5]"
              >
                <Search size={15} />
                Find an answer
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white">
              <img src="/nexora.webp" className="w-4.5" alt="Nexora" />
            </div>

            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
              NEXORA
            </span>

            <span className="text-[10px] text-gray-400">Help Center</span>
          </div>

          <p className="text-[10px] text-gray-400">
            Knowledge is the key to working smarter.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}