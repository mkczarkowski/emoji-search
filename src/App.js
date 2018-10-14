import React, { PureComponent } from "react";
import Header from "./Header";
import SearchInput from "./SearchInput";
import EmojiResults from "./EmojiResults";
import filterEmoji from "./filterEmoji";
import doAsyncCall from "./doAsyncCall";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filteredEmoji: [],
      status: null,
      maxResults: 20
    };
  }

  componentDidMount() {
    doAsyncCall().then(() => {
      this.setState({ filteredEmoji: filterEmoji("", this.state.maxResults) });
    });
  }

  handleSearchChange = event => {
    this.setState({
      filteredEmoji: filterEmoji(event.target.value, this.state.maxResults)
    });
  };

  render() {
    return (
      <div>
        <Header />
        <SearchInput textChange={this.handleSearchChange} />
        <EmojiResults emojiData={this.state.filteredEmoji} />
      </div>
    );
  }
}
export default App;
