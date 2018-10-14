import React from "react";
import App from "./App";
import Header from "./Header";
import SearchInput from "./SearchInput";
import EmojiResults from "./EmojiResults";
import emojiList from "./emojiList.json";
import doAsyncCall from "./doAsyncCall";

jest.mock("./doAsyncCall");

describe("<App />", () => {
  let appWrapper;
  let appInstance;

  const app = (disableLifcycleMethods = false) =>
    shallow(<App />, { disableLifcycleMethods });

  beforeEach(() => {
    appWrapper = app();
    appInstance = appWrapper.instance();
  });

  afterEach(() => {
    appWrapper = undefined;
    appInstance = undefined;
  });

  it("renders without crashing", () => {
    expect(app().exists()).toBe(true);
  });

  it("renders a div", () => {
    expect(appWrapper.first().type()).toBe("div");
  });

  describe("the rendered div", () => {
    const div = () => appWrapper.first();

    it("contains everything else that gets rendered", () => {
      expect(div().children()).toEqual(appWrapper.children());
    });

    it("renders <Header />", () => {
      expect(appWrapper.find(Header).length).toBe(1);
    });

    it("renders <SearchInput />", () => {
      expect(appWrapper.find(SearchInput).length).toBe(1);
    });

    describe("the rendered <SearchInput />", () => {
      const searchInput = () => appWrapper.find(SearchInput);

      it("receives handleSearchChange as a textChange prop ", () => {
        expect(searchInput().prop("textChange")).toEqual(
          appInstance.handleSearchChange
        );
      });
    });

    it("renders <EmojiResults />", () => {
      expect(appWrapper.find(EmojiResults).length).toBe(1);
    });

    describe("the rendered EmojiResults", () => {
      const emojiResults = () => appWrapper.find(EmojiResults);

      it("receives state.filteredEmoji as emojiData prop", () => {
        expect(emojiResults().prop("emojiData")).toEqual(
          appWrapper.state("filteredEmoji")
        );
      });
    });

    describe("the handleSearchQuery method", function() {
      const emptyEvent = { target: { value: "" } };
      const invalidEmojiEvent = { target: { value: "invalid-emoji" } };
      const smileEvent = { target: { value: "smile" } };

      let handleSearchChangeSpy;

      beforeEach(() => {
        handleSearchChangeSpy = jest.spyOn(appInstance, "handleSearchChange");
      });

      afterEach(() => {
        handleSearchChangeSpy.mockClear();
      });

      it("with empty query sets state.filteredEmoji to array with state.maxResults length", () => {
        appInstance.handleSearchChange(emptyEvent);
        appInstance.forceUpdate();
        expect(appInstance.state.filteredEmoji.length).toBe(
          appInstance.state.maxResults
        );
      });

      it("with 'invalid-emoji' query sets state.filteredEmoji to empty array", () => {
        appInstance.handleSearchChange(invalidEmojiEvent);
        appInstance.forceUpdate();
        expect(appInstance.state.filteredEmoji.length).toBe(0);
      });

      it("with 'smile' query sets state.filteredEmoji to array of length greater than 0 and lower than emojiList.json's length", () => {
        appInstance.handleSearchChange(smileEvent);
        appInstance.forceUpdate();
        expect(appInstance.state.filteredEmoji.length).toBeGreaterThan(0);
        expect(appInstance.state.filteredEmoji.length).toBeLessThan(
          emojiList.length
        );
      });
    });

    describe("the componentDidMount lifecycle method", () => {
      it("initializes emoji state", done => {
        // getCoinList to metoda asynchronicza, stąd musimy skorzystać z setTimeout, aby pozwolić na jej wykonanie.
        // Dodatkowy parametr done to funkcja, która daje znać Jest, że może zakończyć przypadek testowy.
        setTimeout(() => {
          // Metoda update() wymusza re-render komponentu, mamy pewność, że stan został zaktualizowany o logikę cDM.
          appWrapper.update();
          const state = appInstance.state;
          expect(state.filteredEmoji.length).toBe(state.maxResults);
          done();
        });
      });
    });
  });
});
