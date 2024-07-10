"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

export default function EmailsCampaign() {
  const [email, setEmail] = useState("")
  const campaigns = [
    {
      id: 1,
      name: "Apsara 1",
      email: "apsarabishwokarma7@gmail.com",
      date: "2024/03/12",
    },
    {
      id: 2,
      name: "Apsara 2",
      email: "apsarabishwokarma7@gmail.com",
      date: "2024/03/12",
    },
    {
      id: 3,
      name: "Apsara 3",
      email: "apsarabishwokarma7@gmail.com",
      date: "2024/03/12",
    },
  ]

  const handleSend = () => {
    console.log("Email sent to:", email)
  }

  return (
    <>
      <div className="max-w-4xl p-4">
        <p className="mb-4 text-lg font-medium">
          Optimize Event Promotions with Smart Email Campaign Strategies
        </p>
        <div className="mb-8 flex items-center space-x-2">
          <input
            type="email"
            placeholder="Enter the email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            className="bg-green-500 text-white hover:bg-green-700"
          >
            Send
          </Button>
        </div>

        <p className="m-4 text-lg font-semibold">Email Campaigns</p>
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Campaign Name
                </th>
                <th className="bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Campaign Email
                </th>
                <th className="bg-gray-100 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {campaign.name}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {campaign.email}
                  </td>
                  <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    {campaign.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
