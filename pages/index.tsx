import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import useKeyPress from "../hooks/useKeypress";
import { useMouseDown } from "../hooks/useMouseDown";
import styles from "../styles/Home.module.css";
import { promises as fs } from "fs";
import LettersDisplay from "../components/LetterDisplay";
import Menu, { MenuSelection } from "../components/Menu";
import PhrasesDisplay from "../components/PhrasesDisplay";
import useAppState from "../data/app-state";

export async function getStaticProps() {
  const data = await fs.readFile("public/words.txt", "utf8");

  return {
    props: { words: data.split("\n") }, // will be passed to the page component as props
  };
}
interface NextPageProps {
  words: string[];
}

const Home: NextPage<NextPageProps> = ({ words }: NextPageProps) => {
  const [appState, setAppState] = useAppState();
  const [currentMenuSelection, setCurrentMenuSelection] =
    useState<MenuSelection>(appState.mode);
  const [speedSeconds, setSpeedSeconds] = useState(2);

  return (
    <div className=" h-screen">
      <Head>
        <title>SpeakEasy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-full w-full m-0 p-0">
        <Menu
          current={appState.mode}
          onChange={(mode) => setAppState({ ...appState, mode })}
        >
          <input
            className="h-full w-20 text-3xl mt-2 ml-2 text-center bg-slate-800 text-white rounded-md shadow-md"
            type="text"
            onChange={(e) => setSpeedSeconds(+e.target.value)}
            value={speedSeconds}
            placeholder="Speed (higher is slower)"
          />
        </Menu>
        <div className="mt-20 h-full">
          {/* {appState.mode === "Letters" && (
          <LettersDisplay
            play={speedSeconds > 0}
            words={words}
            speedMs={(speedSeconds > 0 ? speedSeconds : 2) * 1000}
          />
        )} */}

          {appState.mode === "Phrases" && (
            <PhrasesDisplay
              play={speedSeconds > 0}
              speedMs={(speedSeconds > 0 ? speedSeconds : 2) * 1000}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
