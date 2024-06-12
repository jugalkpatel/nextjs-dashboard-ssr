import Layout from "@/components/Layout";
import { Revenue } from "@/lib/definitions";
import { GetServerSideProps } from "next";
import axios from "axios";
import { lusitana } from "@/components/fonts";
import LatestInvoices from "@/components/dashboard/latest-invoices";
import RevenueChart from "@/components/dashboard/revenue-chart";
import CardWrapper from "@/components/dashboard/cards";

export type Invoice = {
  amount: string;
  id: string;
  name: string;
  image_url: string;
  email: string;
};

export type Stats = {
  numberOfCustomers: number;
  numberOfInvoices: number;
  totalPaidInvoices: number;
  totalPendingInvoices: number;
};

type PageProps = {
  invoices: Invoice[];
  revenue: Revenue[];
  stats: Stats;
};

export const getServerSideProps = (async () => {
  try {
    const invoicesResponse = await axios.get<{ invoices: Invoice[] }>(
      "https://nextjs-dashboard-brown-six-60.vercel.app/api/invoices"
    );

    const revenueResponse = await axios.get<{ revenue: Revenue[] }>(
      "https://nextjs-dashboard-brown-six-60.vercel.app/api/revenue"
    );

    const statsResponse = await axios.get<{ details: Stats }>(
      "https://nextjs-dashboard-brown-six-60.vercel.app/api/details"
    );

    console.log({ invoices: invoicesResponse.data.invoices });

    return {
      props: {
        details: {
          stats: statsResponse.data.details,
          invoices: invoicesResponse.data.invoices,
          revenue: revenueResponse.data.revenue,
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
      props: {
        details: {
          stats: {
            numberOfCustomers: 0,
            numberOfInvoices: 0,
            totalPaidInvoices: 0,
            totalPendingInvoices: 0,
          },
          invoices: [],
          revenue: [],
        },
      },
    };
  }
}) satisfies GetServerSideProps<{ details: PageProps }>;

export default function Dashboard({ details }: { details: PageProps }) {
  const { invoices, revenue, stats } = details;
  console.log({ details });
  return (
    <Layout>
      <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardWrapper {...stats} />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <RevenueChart revenue={revenue} />
          <LatestInvoices invoices={invoices} />
        </div>
      </main>
    </Layout>
  );
}
