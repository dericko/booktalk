const defaultQuestions = [
  "What is 'Flights' by Olga Tokarczuk about?",
  "Who is the author of 'Flights'?",
  "Is 'Flights' a novel or a collection of short stories?",
  "What artists and composers are mentioned in this book?",
  "How does the absence of traditional chapters impact the reading experience and the overall flow of the book?",
  "What is the significance of the story about the Dutch anatomist Philip Verheyen?",
  "In the chapter titled 'Kairos,' what is the main idea or concept being discussed?",
];
const amazonLink =
  "https://www.amazon.com/Flights-Olga-Tokarczuk/dp/0525534202";
const imageUrl = "../assets/flights_cover.jpg";
const imageAlt = "Cover image for the book Flights";

export const BOOK_INFO = {
  defaultQuestions,
  amazonLink,
  imageUrl,
  imageAlt,
};

export const API = "/api/v1";

export const COPY = {
  heading: "Ask Her Book",
  description:
    "This is an experiment in using AI to make a book's content more accessible. Ask a question and AI'll answer it in real-time:",
};
