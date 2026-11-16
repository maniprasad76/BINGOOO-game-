import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeMetaMap: Record<string, { title: string; desc: string }> = {
  '/': {
    title: 'BINGOOO | Rewards Club & Monthly Spin & Win — Srikakulam',
    desc: 'Join BINGOOO Rewards Club in Srikakulam. Monthly Spin & Win, BINGOOO Coins, Refer & Earn, and Free Customised T-Shirts on ₹3000+ bills.'
  },
  '/club': {
    title: 'BINGOOO Rewards Club — Srikakulam Men’s Fashion',
    desc: 'Discover your 5 loyalty benefits: Spin & Win, Coins Wallet, Refer Friends, Store QR Check-in, and Birthday Rewards.'
  },
  '/spin': {
    title: 'Spin & Win Rewards Wheel | BINGOOO Srikakulam',
    desc: 'Spin our monthly reward wheel to win 20% OFF, 10% OFF, 5% OFF, or a FREE Customised T-Shirt on ₹3000+ bills.'
  },
  '/club/wallet': {
    title: 'BINGOOO Coins Wallet | Loyalty Points & Vouchers',
    desc: 'View your BINGOOO Coins balance, transaction ledger, and redeem points for in-store shopping discounts.'
  },
  '/club/refer': {
    title: 'Refer & Earn 50 Coins | BINGOOO Srikakulam',
    desc: 'Invite friends to BINGOOO. They get 5% OFF, and you earn 50 BINGOOO Coins on their first purchase!'
  },
  '/club/check-in': {
    title: 'In-Store QR Check-in | BINGOOO Srikakulam',
    desc: 'Scan our store QR code at Main Road, Srikakulam to earn daily visit reward coins.'
  },
  '/club/birthday': {
    title: 'Annual Birthday Celebration | BINGOOO Rewards',
    desc: 'Celebrate your birthday month with 50 bonus BINGOOO Coins and an exclusive 10% store discount pass.'
  },
  '/rewards': {
    title: 'My Vouchers & Reward Passes | BINGOOO Srikakulam',
    desc: 'Access your active discount coupons and gift passes to redeem at our Srikakulam clothing store.'
  },
  '/login': {
    title: 'Customer Sign In | BINGOOO Rewards Club',
    desc: 'Sign in with your email to access your loyalty wallet, referral code, and saved reward vouchers.'
  },
  '/admin/login': {
    title: 'Staff & Cashier Portal | BINGOOO Srikakulam',
    desc: 'Authorized store staff portal for voucher redemption and purchase point verification.'
  },
  '/how-it-works': {
    title: 'How It Works | BINGOOO Rewards Club',
    desc: 'Step-by-step instructions on monthly spins, earning coins, and redeeming discount vouchers in store.'
  },
  '/contact': {
    title: 'Store Location & Hours | BINGOOO Srikakulam',
    desc: 'Visit BINGOOO Men’s Wear on Main Road, Srikakulam, Andhra Pradesh. Open 10 AM to 9:30 PM daily.'
  },
  '/terms': {
    title: 'Promotion Terms & Conditions | BINGOOO Srikakulam',
    desc: 'Official terms and monthly eligibility guidelines for BINGOOO promotions and vouchers.'
  },
  '/privacy': {
    title: 'Privacy Policy | BINGOOO Men’s Wear',
    desc: 'Read how BINGOOO protects your customer data and account privacy.'
  }
};

export const usePageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const meta = routeMetaMap[location.pathname] || {
      title: 'BINGOOO | Men’s Fashion Store — Srikakulam',
      desc: 'Premium Men’s Wear in Srikakulam, Andhra Pradesh.'
    };

    document.title = meta.title;

    // Update Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.desc);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.desc);

    // Scroll smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
};
