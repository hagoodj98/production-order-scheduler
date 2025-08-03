"use client";
import { Cell, Pie, PieChart, Tooltip, TooltipProps} from 'recharts';
import { newResources } from './Resources';
import type { AvailableSlotPair } from './types';
import { useEffect, useState } from 'react';
import useSWR from "swr";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const Recharts = () => {
  const fetcher =  async (url: string) => {
    const res = await fetch(url);
    return await res.json();
  }
  const { data: fetchedData } = useSWR('/api/poll-resource', fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });
  
  const [data, setData] = useState<AvailableSlotPair[]>([]);
  const [dataSource, setDataSource] = useState<"api" | "fallback">("fallback");

    const getIntroOfPage = (label: string, value: number) => {
        if (label === 'Assembly Line A') {
          return `${value} slots available for this job!`;
        }
        if (label === 'Assembly Line B') {
          return `${value} slots available for this job!`;
        }
        if (label === 'Assembly Line C') {
          return `${value} slots available for this job!`;
        }
        if (label === 'CNC Machine 1') {
          return `${value} slots available for this job!`;
        }
        return '';
      };
      
    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        const isVisible = active && payload && payload.length;

        if (!isVisible) return null;
        const dataItem = payload[0];
        const name = dataItem?.name;
        const value = dataItem?.value;

        return (
          
          <div className="tw-bg-white tw-p-4" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
            {isVisible && (
              <>
                <p className="tw-text-base tw-text-[#00C49F] ">{`${name}`}</p>
                <p className="intro tw-text-sm">{getIntroOfPage(name as string, value as number)}</p>
              </>
            )}
          </div>
        );
      };
      
      useEffect(() => {
       
        const rawData = fetchedData?.availability ?? newResources;
        const fromAPI = Boolean(fetchedData?.availability);
      
        const transformedData: AvailableSlotPair[] = rawData.map((resource: any) => {
  
          console.log('what it is currently');
          
          const availableSlot = Object.values(resource).filter(value => value === 'Available' || value === 'Pending').length;
          return {
            name: resource.name,
            value: availableSlot,
          };
        });
      
        setData(transformedData);
        setDataSource(fromAPI ? "api" : "fallback");
      }, [fetchedData]);

    if (data.length === 0) return <p>Loading chart...</p>;

  return (
        <div className='tw-relative tw-h-96'>
            <PieChart className='tw-absolute tw-top-20 tw-m-auto' width={300} height={205}>
                <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={15}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>  
        </div>
  );
};

export default Recharts;
