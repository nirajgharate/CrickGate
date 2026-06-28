// src/data/Tournament.js
import turfgateCricket from "../assets/turfgate_cricket.png";
import turfgateFootball from "../assets/turfgate_football.png";
import turfgateBasketball from "../assets/turfgate_basketball.png";
import turfgateTournament from "../assets/turfgate_tournament_bg.png";

export const tournaments = [
  {
    id: 1,
    name: "PREMIER CRICKET LEAGUE",
    sport: "Cricket",
    date: "November 29, 2026",
    location: "Ary City Cricket Grounds, Box 1",
    category: "T20",
    image: turfgateCricket,
    registrationDeadline: "November 10, 2026",
    prizePool: {
      first: 5500,
      second: 3200,
      third: 1800
    },
    teamComposition: "11 players + 4 substitutes",
    tournamentTime: "Day-Night (2:00 PM - 10:00 PM)"
  },
  {
    id: 2,
    name: "CHAMPIONS SOCCER CUP",
    sport: "Football",
    date: "July 29, 2026",
    location: "Battle Ground Arena, Main Turf",
    category: "5-a-side",
    image: turfgateFootball,
    registrationDeadline: "July 12, 2026",
    prizePool: {
      first: 4800,
      second: 3800,
      third: 2200
    },
    teamComposition: "5 players + 3 substitutes",
    tournamentTime: "Day (9:00 AM - 5:00 PM)"
  },
  {
    id: 3,
    name: "CITY CRICKET CHAMPIONSHIP",
    sport: "Cricket",
    date: "July 29, 2026",
    location: "Vebu Box Cricket Academy",
    category: "T20",
    image: turfgateCricket,
    registrationDeadline: "July 26, 2026",
    prizePool: {
      first: 5200,
      second: 3600,
      third: 2400
    },
    teamComposition: "7 players + 2 substitutes",
    tournamentTime: "Evening (4:00 PM - 9:00 PM)"
  },
  {
    id: 4,
    name: "WINTER CRICKET SERIES",
    sport: "Cricket",
    date: "January 24, 2027",
    location: "Cover Drive Pitch, Indoor Nets",
    category: "Test",
    image: turfgateCricket,
    registrationDeadline: "January 10, 2027",
    prizePool: {
      first: 6000,
      second: 4000,
      third: 3000
    },
    teamComposition: "11 players + 2 substitutes",
    tournamentTime: "Multi-day (10:00 AM - 5:00 PM daily)"
  },
  {
    id: 5,
    name: "SUPER SOCCER LEAGUE",
    sport: "Football",
    date: "June 25, 2026",
    location: "Ary City Football Club Arena",
    category: "7-a-side",
    image: turfgateTournament,
    registrationDeadline: "June 10, 2026",
    prizePool: {
      first: 7500,
      second: 4500,
      third: 2800
    },
    teamComposition: "11 players + 5 substitutes",
    tournamentTime: "Night (6:00 PM - 11:00 PM)"
  },
  {
    id: 6,
    name: "SUMMER FOOTBALL BLAST",
    sport: "Football",
    date: "September 25-30, 2026",
    location: "Ranangan Arena 2",
    category: "5-a-side",
    image: turfgateFootball,
    registrationDeadline: "September 10, 2026",
    prizePool: {
      first: 4200,
      second: 3000,
      third: 1600
    },
    teamComposition: "5 players + 2 substitutes",
    tournamentTime: "Weekend (10:00 AM - 6:00 PM)"
  },
  {
    id: 7,
    name: "MONSOON FUTSAL CUP",
    sport: "Football",
    date: "Multiple Dates",
    location: "Cover Drive Sports Complex",
    category: "Futsal",
    image: turfgateTournament,
    registrationDeadline: "Rolling Basis",
    prizePool: {
      first: 3800,
      second: 2800,
      third: 1500
    },
    teamComposition: "8 players + 2 substitutes",
    tournamentTime: "Flexible timing (As per fixture)"
  },
  {
    id: 8,
    name: "GRAND BASKETBALL CHAMPIONSHIP",
    sport: "Basketball",
    date: "August 15-20, 2026",
    location: "Ary City International Court",
    category: "3v3",
    image: turfgateBasketball,
    registrationDeadline: "August 1, 2026",
    prizePool: {
      first: 8500,
      second: 5200,
      third: 3500
    },
    teamComposition: "3 players + 2 substitutes",
    tournamentTime: "Full Day (9:00 AM - 8:00 PM)"
  },
  {
    id: 9,
    name: "YOUTH BASKETBALL CUP",
    sport: "Basketball",
    date: "March 15-20, 2027",
    location: "City Youth Court Center",
    category: "Under-19",
    image: turfgateBasketball,
    registrationDeadline: "March 1, 2027",
    prizePool: {
      first: 3200,
      second: 2000,
      third: 1200
    },
    teamComposition: "5 players + 3 substitutes",
    tournamentTime: "School Hours (8:00 AM - 3:00 PM)"
  }
];