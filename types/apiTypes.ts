export type DashboardPageReactions = {
  [reactionType: string]: number;
};

export type WidgetSettings = {
  layout?: string;
  position?: string;
  prompt?: string;
  domSelector?: string;
  bordered?: boolean;
  fontSizeScale?: number;
  fontColor?: string;
  theme?: string;
};

export type DashboardSite = {
  id: string;
  hostname: string;
  active: boolean;
  max_reactions_per_ip: number;
  max_reactions_per_ip_period_seconds: number;
  show_reaction_counts: boolean;
  emojis: string[];
  pages: {
    [pageId: string]: DashboardPageReactions;
  };
  widget_settings: WidgetSettings;
};

export type DashboardSitesResponse = {
  error: boolean;
  sites: DashboardSite[];
};
