import {
  PieChart,
  Tag,
  Hash,
  Power,
  Building2,
  Database,
  Ban,
  Users,
  Wrench,
  Box,

  IndianRupee,
  User,
  XCircle,
  Gem,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  Coins,

  Grid2X2,
  CircleXIcon, LayoutDashboard,
  RefreshCw,
  UserCircle,
  Receipt,

  BadgeIndianRupee,
  Settings,

  Wallet,
  ShieldBan,
  X, CreditCard, ShieldAlert, UserX,
  FilePlus,
  FileText

} from "lucide-react";
import PERMISSIONS from "./persmission";

export const NAVLINKS = [
  {
    route: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    permission: PERMISSIONS.DASHBOARD,
    type: "link",
  },


  { route: "Config", icon: RefreshCw, href: "/config", permission: PERMISSIONS.CONFIG, type: "link" },

  {
    route: "User Profile",
    icon: UserCircle,
    href: "/user-profile",
    permission: PERMISSIONS.USER_PROFILE,
    type: "link",
  },
  {
    route: "Pricing",
    icon: BadgeIndianRupee,
    href: "/pricing",
    permission: PERMISSIONS.PRICING,
    type: "link",
  },

  {
    route: "Transactions",
    icon: Receipt,
    type: "dropdown",
    options: [
      {
        route: "Cancel Transaction",
        icon: X,
        href: "/transactions/cancel-txn",
        permission: PERMISSIONS.CANCEL_TXN,
      },
    ],
  },
  {
    route: "Invoice",
    icon: Receipt,
    type: "dropdown",
    options: [
      {
        route: "Create Invoice",
        icon: FilePlus,
        href: "/invoices/create-invoice",
        permission: PERMISSIONS.CREATE_INVOICE,
      },

    ],
  },


  {
    route: "Redemption",
    icon: Database,
    type: "dropdown",
    options: [
      {
        route: "Redemption Info",
        icon: FileText,
        href: "/redemption/redemption-info",
        permission: PERMISSIONS.REDEMPTION_INFO,
      },
      {
        route: "Create Redemption",
        icon: FilePlus,
        href: "/redemption/create-redemption",
        permission: PERMISSIONS.CREATE_REDEMPTION,
      },


    ],
  },



  {
    route: "Gold",
    icon: Coins,
    type: "dropdown",
    options: [
      // {
      //   route: "Gold Redemption",
      //   icon: Database,
      //   href: "/gold/transactions/gold-redemption",
      //   permission: PERMISSIONS.GOLD_REDEMPTION,
      // },
      // {
      //   route: "Sell",
      //   icon: Tag,
      //   href: "/gold/transactions/sell-transactions",
      //   permission: PERMISSIONS.GOLD_SELL,
      // },
      {
        route: "Revoke Mandate",
        icon: CreditCard,
        href: "/gold/mandates/revoke",
        permission: PERMISSIONS.GOLD_REVOKE,
      },
      {
        route: "Deposit Gold",
        icon: ArrowDownToLine,
        href: "/gold/transactions/deposit-gold",
        permission: PERMISSIONS.GOLD_DEPOSIT,
      },
      {
        route: "Withdraw Gold",
        icon: ArrowUpFromLine,
        href: "/gold/transactions/withdraw-gold",
        permission: PERMISSIONS.GOLD_WITHDRAW,
      },
      // {
      //   route: "Offers",
      //   icon: Gift,
      //   href: "/gold/offers",
      //   permission: PERMISSIONS.GOLD_OFFERS,
      // },
    ],
  },


  {
    route: "Silver",
    icon: BadgeIndianRupee,
    type: "dropdown",
    options: [
      // {
      //   route: "Silver Redemption",
      //   icon: Database,
      //   href: "/silver/transactions/silver-redemption",
      //   permission: PERMISSIONS.SILVER_REDEMPTION,
      // },
      // {
      //   route: "Sell",
      //   icon: Tag,
      //   href: "/silver/transactions/sell-transactions",
      //   permission: PERMISSIONS.SILVER_SELL,
      // },
      {
        route: "Revoke Mandate",
        icon: CreditCard,
        href: "/silver/mandates/revoke",
        permission: PERMISSIONS.SILVER_REVOKE,
      },
      {
        route: "Deposit Silver",
        icon: ArrowDownToLine,
        href: "/silver/transactions/deposit",
        permission: PERMISSIONS.SILVER_DEPOSIT,
      },
      {
        route: "Withdraw Silver",
        icon: ArrowUpFromLine,
        href: "/silver/transactions/withdraw-silver",
        permission: PERMISSIONS.SILVER_WITHDRAW,
      },

    ],
  },

  {
    route: "Offers",
    icon: Gift,
    href: "/offers",

    permission: PERMISSIONS.OFFERS,
    type: "link",
  },

  // {
  //   route: "Wallet",
  //   icon: Wallet,
  //   href: "/wallet",
  //   permission: PERMISSIONS.WALLET,
  //   type: "link",
  // },

  // {
  //   route: "Mandate",
  //   icon: CreditCard,
  //   href: "/mandate",
  //   permission: PERMISSIONS.MANDATE,
  //   type: "link",
  // },

  // {
  //   route: "Users",
  //   icon: Users,
  //   href: "/users",
  //   permission: PERMISSIONS.USERS,
  //   type: "link",
  // },
  {
    route: "Block",
    icon: ShieldAlert,
    type: "dropdown",
    options: [
      {
        route: "Blocked Users",
        icon: UserX,
        href: "/block/users",
        permission: PERMISSIONS.BLOCK_USERS,
      },
      {
        route: "Blocked UPIs",
        icon: CreditCard,
        href: "/block/upis",
        permission: PERMISSIONS.BLOCK_UPIS,
      },
    ],
  },

  {
    route: "Jewellery",
    icon: Gem,
    href: "/jewellery",
    permission: PERMISSIONS.JEWELLERY,
    type: "link",
  },

  // {
  //   route: "Settings",
  //   icon: Settings,
  //   href: "/settings",
  //   permission: PERMISSIONS.SETTINGS,
  //   type: "link",
  // },
];





export const FREE_NAVLINKS = [
  { route: "Dashboard", icon: Grid2X2, href: "/dashboard", permission: PERMISSIONS.DASHBOARD },
  { route: "Update", icon: PieChart, href: "/update", permission: PERMISSIONS.UPDATE },
  { route: "User Profile", icon: User, href: "/user-profile", permission: PERMISSIONS.USER_PROFILE },

  { route: "Cancel Transaction", icon: CircleXIcon, href: "/transactions/cancel-txn", permission: PERMISSIONS.CANCEL_TXN },

  { route: "Gold Redemption", icon: Database, href: "/gold/transactions/gold-redemption", permission: PERMISSIONS.GOLD_REDEMPTION },
  { route: "Gold Sell", icon: Tag, href: "/gold/transactions/sell-transactions", permission: PERMISSIONS.GOLD_SELL },
  { route: "Revoke Gold Mandate", icon: CreditCard, href: "/gold/mandates/revoke", permission: PERMISSIONS.GOLD_REVOKE },
  { route: "Deposit Gold", icon: ArrowDownToLine, href: "/gold/transactions/deposit-gold", permission: PERMISSIONS.GOLD_DEPOSIT },
  { route: "Withdraw Gold", icon: ArrowUpFromLine, href: "/gold/transactions/withdraw-gold", permission: PERMISSIONS.GOLD_WITHDRAW },
  { route: "Gold Offers", icon: Gift, href: "/gold/offers", permission: PERMISSIONS.GOLD_OFFERS },


  { route: "Silver Redemption", icon: Database, href: "/silver/transactions/gold-redemption", permission: PERMISSIONS.SILVER_REDEMPTION },
  { route: "Silver Sell", icon: Tag, href: "/silver/transactions/sell-transactions", permission: PERMISSIONS.SILVER_SELL },
  { route: "Revoke Silver Mandate", icon: CreditCard, href: "/silver/mandates/revoke", permission: PERMISSIONS.SILVER_REVOKE },
  { route: "Deposit Silver", icon: ArrowDownToLine, href: "/silver/transactions/deposit", permission: PERMISSIONS.SILVER_DEPOSIT },
  { route: "Withdraw Silver", icon: ArrowUpFromLine, href: "/silver/transactions/withdraw-silver", permission: PERMISSIONS.SILVER_WITHDRAW },
  { route: "Silver Offers", icon: Gift, href: "/silver/offers", permission: PERMISSIONS.SILVER_OFFERS },


  { route: "Config", icon: Wrench, href: "/config", permission: PERMISSIONS.CONFIG },
  { route: "Users", icon: Users, href: "/users", permission: PERMISSIONS.USERS },
  { route: "Wallet", icon: CreditCard, href: "/wallet", permission: PERMISSIONS.WALLET },
  { route: "Mandate", icon: IndianRupee, href: "/mandate", permission: PERMISSIONS.MANDATE },
  { route: "Block Users", icon: Ban, href: "/block/users", permission: PERMISSIONS.BLOCK_USERS },
  { route: "Block UPIs", icon: Ban, href: "/block/upis", permission: PERMISSIONS.BLOCK_UPIS },
  { route: "Jewellery", icon: Gem, href: "/jewellery", permission: PERMISSIONS.JEWELLERY },
  { route: "Settings", icon: Wrench, href: "/settings", permission: PERMISSIONS.SETTINGS },
];

export const NAVLINKSLIMITED = [
  {
    route: "Gold Redemption",
    icon: Database,
    href: "/gold-redemption",
  },
  {
    route: "Silver Redemption",
    icon: Database,
    href: "/silver-redemption",
  },
];