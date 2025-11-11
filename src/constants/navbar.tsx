import {
  ChartPieIcon,
  TagIcon,
  HashtagIcon,
  PowerIcon,
  BuildingLibraryIcon,
  CircleStackIcon,
  NoSymbolIcon,
  UsersIcon,
  WrenchIcon,
  CubeIcon,
  CreditCardIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

export const NAVLINKS = [
  {
    route: "Dashboard",
    icon: ChartPieIcon,
    href: "/dashboard",
  },
  {
    route: "update",
    icon: ChartPieIcon,
    href: "/update",
  },
  {
    route: "Gold",
    icon: CubeIcon,
    href: "/dashboard",
    type: "dropdown",
    options: [
      {
        route: "Gold Redemption",
        icon: CircleStackIcon,
        href: "/gold/transactions/gold-redemption",
      },
      {
        route: "Sell",
        icon: TagIcon,
        href: "/gold/transactions/sell-transactions",
      },
      {
        route: "Revoke mandate",
        icon: CreditCardIcon,
        href: "/gold/mandates/revoke",
      },
      {
        route: "Deposit gold",
        icon: BuildingLibraryIcon,
        href: "/gold/transactions/deposit-gold",
      },
      {
        route: "Offers",
        icon: HashtagIcon,
        href: "/gold/offers",
      },
    ],
  },
  {
    route: "Silver",
    icon: CubeIcon,
    href: "/dashboard",
    type: "dropdown",
    options: [
      {
        route: "Silver Redemption",
        icon: CircleStackIcon,
        href: "/silver/transactions/gold-redemption",
      },
      {
        route: "Sell",
        icon: TagIcon,
        href: "/silver/transactions/sell-transactions",
      },
      {
        route: "Revoke mandate",
        icon: CreditCardIcon,
        href: "/silver/mandates/revoke",
      },
      {
        route: "Deposit",
        icon: BuildingLibraryIcon,
        href: "/silver/transactions/deposit",
      },
      {
        route: "Offers",
        icon: HashtagIcon,
        href: "/silver/offers",
      },
    ],
  },
  // {
  //   route: "Buy",
  //   icon: CreditCardIcon,
  //   href: "/transactions/buy-transactions",
  // },

  {
    route: "Users",
    icon: UsersIcon,
    href: "/users",
  },

  {
    route: "Wallet",
    icon: CreditCardIcon,
    href: "/wallet",
  },

  {
    route: "Mandate",
    icon: CurrencyRupeeIcon,
    href: "/mandate",
  },
  {
    route: "Block",
    icon: NoSymbolIcon,
    href: "/dashboard/block",
    type: "dropdown",
    options: [
      {
        route: "Users",
        icon: NoSymbolIcon,
        href: "/block/users",
      },
      {
        route: "Upis",
        icon: NoSymbolIcon,
        href: "/block/upis",
      },
    ],
  },
  {
    route: "Jewellery",
    icon: CubeIcon,
    href: "/jewellery",
  },
  {
    route: "Settings",
    icon: WrenchIcon,
    href: "/settings",
  },
];

export const NAVLINKSLIMITED = [
  {
    route: "Gold Redemption",
    icon: CircleStackIcon,
    href: "/gold-redemption",
  },
  {
    route: "Silver Redemption",
    icon: CircleStackIcon,
    href: "/silver-redemption",
  },
];
