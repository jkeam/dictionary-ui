'use client';
import Image from "next/image";
import Script from "next/script";
import Head from "next/head";
import { useState } from "react";
import { path } from "ramda";
import Spinner from "./Spinner.js";

export default function Home() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();
      if (data["title"]) {
        return setDefinition(data["title"]);
      }
      const retrieved = path([0, "meanings", 0, "definitions", 0, "definition"], data);
      return setDefinition(retrieved || "Unable to find definition");
    } catch(e) {
      console.error(e);
      setDefinition("Unable to find definition");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setWord(e.currentTarget.value);
 
  return (
    <div className="container px-5 py-24 mx-auto">
      <h1 className="title-font text-xl mb-3">Dictionary</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <input
            type="text"
            id="word"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Word to lookup"
            value={word}
            onChange={onChange}
          />
        </div>
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
      <div className="pt-10 mx-auto">
        { isLoading && <Spinner /> }
        { !isLoading && <p> {definition} </p> }
      </div>
    </div>
  );
}
