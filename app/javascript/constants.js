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
const imageUrl = "https://m.media-amazon.com/images/I/41CDpsiFjQL._SX318_BO1,204,203,200_.jpg";
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
    "Hi, this is an experiment in using AI to make the contents of a book more accessible. What would you like to know about it?",
  sourceUrl: "https://github.com/dericko/react-rails-askmybook",
  sourceText: "github.com/dericko",
  credits: "For personal + educational use only. I don't own this book nor any rights to it 🙃",
};
