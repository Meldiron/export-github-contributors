import { Octokit } from "@octokit/rest";
import * as dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const fetchAllContributors = async (owner, repo, page = 0) => {
  const response = await octokit.rest.repos.listContributors({
    owner,
    repo,
    per_page: 100,
    page,
  });

  const contributors = [...response.data.map((contributor) => contributor.id)];

  if (response.data.length <= 0) {
    return contributors;
  }

  const nextPage = await fetchAllContributors(owner, repo, page + 1);

  return [...contributors, ...nextPage];
};

try {
  const contributors1 = await fetchAllContributors("appwrite", "appwrite");
  const contributors2 = await fetchAllContributors(
    "appwrite",
    "awesome-appwrite"
  );
  const contributors3 = await fetchAllContributors(
    "open-runtimes",
    "open-runtimes"
  );
  const contributors4 = await fetchAllContributors("open-runtimes", "examples");

  const contributors = [
    ...new Set([
      ...contributors1,
      ...contributors2,
      ...contributors3,
      ...contributors4,
    ]),
  ];

  console.log(JSON.stringify(contributors));
} catch (err) {
  console.log("Error:");
  console.error(err);
}
