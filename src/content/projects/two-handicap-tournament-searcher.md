---
title: "2-Handicap Tournament Searcher"
summary: "A Python backtracking search for small 2-handicap tournament graphs, using weight-based pruning, multiprocessing, and a symmetric search variant for graph families."
year: "2019"
tools: ["Python", "multiprocessing", "recursive backtracking", "graph theory"]
links:
  - label: "View code"
    href: "https://github.com/wallysands/TournamentSearch"
status: "available"
image: "/projects/tournament-searcher/graph-20.jpg"
---

2-Handicap Tournament Searcher grew out of a UROP research project on regular handicap tournaments. In these tournaments, each team plays only `k` opponents, and the strength of schedule increases arithmetically with team rank. The project focused on the `d = 2` case: schedule weights should rise by exactly two from one seed to the next.

The search represents a tournament as an `n` by `k` matrix of opponents. A recursive backtracking function walks through each team and game slot, proposes an opponent, mirrors that edge into the opponent's row, and continues only if both rows can still become valid schedules.

Several pruning checks keep the search from trying every possible graph blindly. Completed rows must equal their target weight, partial rows stop early if they already exceed that weight, duplicate opponents are rejected, and opponent rows are checked to make sure their remaining empty slots can still reach the required total.

The general search splits the first team's possible opponent range across multiple worker processes. A second symmetric scheduler searches half of the graph while enforcing a complementary structure, which was useful for tournaments where the number of teams is divisible by four.

The final poster summarized small 2-handicap tournament results, including valid examples for `(11, 4)`, `(13, 6)`, `(14, 6)`, `(15, 4)`, `(15, 6)`, and `(15, 8)`. It also showed symmetric 4-regular examples on 20, 24, and 28 vertices, supporting the broader graph-family discussion.

## Graph results

<div class="project-figure-grid project-figure-grid-compact">
  <figure>
    <img src="/website/projects/tournament-searcher/graph-11.jpg" alt="A 4-regular 2-handicap tournament graph on 11 vertices." loading="lazy" />
    <figcaption>A 4-regular, 2-handicap tournament on 11 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-20.jpg" alt="A 4-regular 2-handicap tournament graph on 20 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 20 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-24.jpg" alt="A 4-regular 2-handicap tournament graph on 24 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 24 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-28.jpg" alt="A 4-regular 2-handicap tournament graph on 28 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 28 vertices.</figcaption>
  </figure>
</div>
