import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, DatePicker, Radio, Space, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// ডেমো ডেটা - গত 6 মাসের জন্য
const generateDemoData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // রিয়েলিস্টিক আয় ডেটা জেনারেট করা
    const baseEarnings = 10000;
    const randomFactor = Math.sin(i / 30) * 0.5 + Math.random() * 0.3;
    const earnings = Math.round(baseEarnings * (1 + i/60) * (1 + randomFactor));
    
    data.push({
      date: date.toISOString().split('T')[0],
      earnings: earnings,
      growth: Math.round(randomFactor * 100)
    });
  }
  
  return data;
};

function EarningsGrowth() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState('1m');
  const [customRange, setCustomRange] = useState(null);
  const [stats, setStats] = useState({});

  // কম্পোনেন্ট মাউন্ট হলে ডেটা লোড করা
  useEffect(() => {
    const demoData = generateDemoData();
    setData(demoData);
  }, []);

  // ডেটা ফিল্টার করার ফাংশন
  useEffect(() => {
    if (data.length === 0) return;

    let startDate, endDate;
    const today = new Date();

    if (dateRange === 'custom' && customRange) {
      startDate = customRange[0];
      endDate = customRange[1];
    } else {
      endDate = today;
      
      switch(dateRange) {
        case '1w':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7);
          break;
        case '1m':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '3m':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 3);
          break;
        case '6m':
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 6);
          break;
        case '1y':
          startDate = new Date(today);
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 1);
      }
    }

    const filtered = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    setFilteredData(filtered);

    // স্ট্যাটিস্টিক্স ক্যালকুলেট করা
    if (filtered.length > 0) {
      const firstEarning = filtered[0].earnings;
      const lastEarning = filtered[filtered.length - 1].earnings;
      const growthPercentage = ((lastEarning - firstEarning) / firstEarning * 100).toFixed(2);
      const totalGrowth = lastEarning - firstEarning;
      
      setStats({
        currentEarnings: lastEarning,
        growthPercentage: parseFloat(growthPercentage),
        totalGrowth: totalGrowth,
        period: filtered.length > 30 ? `${Math.round(filtered.length / 30)} months` : 
                filtered.length > 7 ? `${Math.round(filtered.length / 7)} weeks` : 
                `${filtered.length} days`
      });
    }
  }, [data, dateRange, customRange]);

  // কাস্টম রেঞ্জ হ্যান্ডলার
  const handleCustomRange = (dates) => {
    if (dates) {
      setCustomRange([dates[0].toDate(), dates[1].toDate()]);
      setDateRange('custom');
    } else {
      setCustomRange(null);
      setDateRange('1m');
    }
  };

  // টুলটিপ ফরম্যাটার
  const formatTooltip = (value, name) => {
    if (name === 'earnings') {
      return [`$${value.toLocaleString()}`, 'Earnings'];
    }
    return [value, name];
  };

  return (
    <div className="">
      <div className=" ">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Earnings Growth</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* স্ট্যাটিস্টিক্স কার্ড */}
          <Card className="shadow-md">
            <Statistic
              title="Current Earnings"
              value={stats.currentEarnings}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix="$"
            />
          </Card>
          
          <Card className="shadow-md">
            <Statistic
              title={`Growth (${stats.period || 'period'})`}
              value={stats.growthPercentage || 0}
              precision={2}
              valueStyle={{ 
                color: stats.growthPercentage >= 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix={stats.growthPercentage >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
          
          <Card className="shadow-md">
            <Statistic
              title="Total Growth"
              value={stats.totalGrowth || 0}
              precision={0}
              valueStyle={{ 
                color: stats.totalGrowth >= 0 ? '#3f8600' : '#cf1322' 
              }}
              prefix={stats.totalGrowth >= 0 ? "+$" : "-$"}
            />
          </Card>
        </div>
        
        {/* মেইন চার্ট কার্ড */}
        <Card 
          title="Earnings Over Time" 
          className="shadow-lg"
          extra={
            <Space direction="vertical" size="middle">
              <Radio.Group 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="1w">1W</Radio.Button>
                <Radio.Button value="1m">1M</Radio.Button>
                <Radio.Button value="3m">3M</Radio.Button>
                <Radio.Button value="6m">6M</Radio.Button>
                <Radio.Button value="1y">1Y</Radio.Button>
              </Radio.Group>
              
              <RangePicker 
                onChange={handleCustomRange}
                format="YYYY-MM-DD"
                placeholder={['Start Date', 'End Date']}
              />
            </Space>
          }
        >
          <div className="h-80 md:h-96">
            {filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip 
                    formatter={formatTooltip}
                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#1890ff" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    name="Earnings"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading data...</p>
              </div>
            )}
          </div>
        </Card>
        
      
      </div>
    </div>
  );
}

export default EarningsGrowth;