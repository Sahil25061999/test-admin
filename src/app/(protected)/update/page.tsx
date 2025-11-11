'use client';
import React, { useState } from 'react';

const Page = () => {
  const [formData, setFormData] = useState({
    banner: false,
    current_version: '',
    display_chain: false,
    hero_image: {
      height: 0,
      img_link: ''
    },
    gold_buy_spread: 0,
    gold_sell_spread: 0,
    silver_buy_spread: 0,
    silver_sell_spread: 0,
    offer_discount: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    if (name.includes('hero_image.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hero_image: {
          ...prev.hero_image,
          [key]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(formData);
    // Do something with the formData
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="banner" checked={formData.banner} onChange={handleChange} />
        Show Banner
      </label>

      <label className="block">
        <span>Current Version</span>
        <input
          type="text"
          name="current_version"
          value={formData.current_version}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="display_chain" checked={formData.display_chain} onChange={handleChange} />
        Display Chain
      </label>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold">Hero Image</h2>
        <label className="block mt-2">
          <span>Height</span>
          <input
            type="number"
            name="hero_image.height"
            value={formData.hero_image.height}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label className="block mt-2">
          <span>Image Link</span>
          <input
            type="text"
            name="hero_image.img_link"
            value={formData.hero_image.img_link}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label>
          <span>Gold Buy Spread</span>
          <input
            type="number"
            name="gold_buy_spread"
            value={formData.gold_buy_spread}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          <span>Gold Sell Spread</span>
          <input
            type="number"
            name="gold_sell_spread"
            value={formData.gold_sell_spread}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          <span>Silver Buy Spread</span>
          <input
            type="number"
            name="silver_buy_spread"
            value={formData.silver_buy_spread}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label>
          <span>Silver Sell Spread</span>
          <input
            type="number"
            name="silver_sell_spread"
            value={formData.silver_sell_spread}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
        <label className="col-span-2">
          <span>Offer Discount</span>
          <input
            type="number"
            name="offer_discount"
            value={formData.offer_discount}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </form>
  );
};

export default Page;
