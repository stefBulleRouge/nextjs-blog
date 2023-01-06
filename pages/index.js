import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { useState, useEffect } from 'react'

import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Date from '../components/date';

// Add these imports at the top of the file
const { MongoClient } = require('mongodb');
const uri = "mongodb://sjklDE4edjJJC3320D:<insertYourPassword>@docdb-2023-01-05-16-51-08.cluster-c7kzelklspap.eu-west-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false";
const client = new MongoClient(uri, { useNewUrlParser: true });

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home ({ allPostsData }) {
  // Add this state variable and useEffect hook to fetch data from Amazon DocumentDB
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await client.connect();
      const collection = client.db("test").collection("devices");
      // Read all documents from the collection
      const docs = await collection.find().toArray();
      setDocs(docs);
      client.close();
    }
    fetchData();
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>
         jklmjmlkjm 
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
       {/* Add this <section> tag below the existing <section> tag */}
       <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        {/* Add a loop to display the documents from Amazon DocumentDB */}
        {docs.map(doc => (
          <p key={doc._id}>{doc.name}</p>
        ))}
      </section>
    </Layout>
  );
}
