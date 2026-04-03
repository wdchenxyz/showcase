# Story Flow: Dynamic Topic Archaeology

## Concept

A dynamic extension of the Story Flow page that builds branching timelines from real articles using semantic similarity APIs, instead of static demo data. Users enter a topic and the system traces the story's evolution backward through time, revealing how it branched into subtopics.

## Available APIs

1. **Search API** — given a query string (e.g. "Trump Tariffs"), returns articles that are semantically similar to that query.
2. **Trace-back API** — given a specific article, finds related articles from earlier time periods by similarity.

## How It Works

### Phase 1 — Seed Articles
User enters a topic (e.g. "Trump Tariffs"). The Search API returns recent articles matching that topic. These become the "leaf" nodes at the end of the timeline.

### Phase 2 — Trace Back
For each seed article, the Trace-back API finds earlier related articles. Those earlier articles become parent nodes. This process repeats recursively to build the tree upward in time.

### Result
A branching tree rooted in the earliest articles, growing forward in time toward the seed articles — showing how a story evolved and split into subtopics.

## Branching Behavior

- Different seed articles may trace back to the **same** earlier article (convergence) or to completely **different** earlier articles (divergence).
- Some branches may be tightly on-topic (e.g. "tariff negotiations with China"), while others drift into adjacent subtopics (e.g. "stock market reaction", "EU retaliatory measures") — this is expected and valuable, not noise.
- The tree structure emerges organically from the similarity relationships, not from manual curation.

## Summary

The flow chart becomes a **topic archaeology tool** — you dig into a topic, and it reveals the story's ancestry and how it branched over time.
