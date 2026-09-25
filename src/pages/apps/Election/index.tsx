import ElectionTabs from "./Electiontabs";

const YEARS = ["2013", "2018", "2023", "2028"];

/**
 * MLA election page — now just a thin wrapper around the generic
 * <ElectionTabs /> engine (see pages/apps/Election/). All candidates /
 * pdfs / summary data is stored together in ONE MongoDB collection
 * ("elections", electionType: "MLA").
 *
 * To add TP / ZP / Purasabha elections later: copy this file, change
 * `electionType`, `YEARS` and `title` — no other code changes needed.
 */
export default function MlaElectionMainPage() {
  return (
    <ElectionTabs electionType="MLA" years={YEARS} title="ವಿಧಾನಸಭಾ ಸಾರ್ವತ್ರಿಕ ಚುನಾವಣೆ" />
  );
}