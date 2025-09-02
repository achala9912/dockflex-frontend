"use Client";

import React, { useEffect, useState } from 'react';
import OverviewCard from './OverviewCard';
import {
  BedDouble,
  BookCheck,
  CopyCheck,
  Hotel,
  LampWallUp,
} from 'lucide-react';


const Overview: React.FC = () => {

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      {error && <div>{error}</div>}
      <h1 className="text-xl text-black font-interMedium">Overview</h1>
      <div className="grid gap-4 mt-3 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        <OverviewCard
          title="Total Menus"
          subtitle="Today's"
          value={'65665654'}
          className="h-full border-l-8 border-blue-500"
          icon={<BookCheck className="text-blue-500" />}
        />
        <OverviewCard
          title="Total Revenue"
          subtitle="Today's"
          value={'4654654'}
          className="h-full border-l-8 border-green-500"
          icon={<CopyCheck className="text-green-500" />}
        />
        <OverviewCard
          title="Total Orders"
          subtitle="Total"
          value={'52412'}
          className="h-full border-l-8 border-red-500"
          icon={<Hotel className="text-red-500" />}
        />
        <OverviewCard
          title="Total Customer"
          subtitle="Total"
          value={'3544554'}
          className="h-full border-l-8 border-yellow-500"
          icon={<BedDouble className="text-yellow-500" />}
        />
        <OverviewCard
          title="Take Away Order"
          subtitle="Total"
          value={'3241321'}
          className="h-full border-l-8 border-purple-500"
          icon={<LampWallUp className="text-purple-500" />}
        />

      </div>
    </div>
  );
};

export default Overview;
