import React from "react";
import { Redirect } from "react-router-dom";

const PLANET_URL = "http://52.53.150.109:8080/AdeptusAdministratum";
const GARRISON_URL = "http://52.53.150.109:8080/AdeptusAdministratum/garrisons";

export default class EditPlanet extends React.Component {
  state = {
    id: "",
    name: "",
    inhabitants: "",
    population: "",
    garrisonId: "",
    garrison: {
      id: 0,
      chapter: "",
      size: 0,
    },
    garrisonArray: [
      {
        id: 0,
        chapter: "",
        size: "",
      },
    ],
    redirect: false,
  };

  componentDidMount() {
    fetch(GARRISON_URL)
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ garrisonArray: [...json] });
      });

    fetch(PLANET_URL + this.props.match.url)
      .then((resp) => resp.json())
      .then((json) => {
        const garrison = {
          id: json.garrison.id,
          chapter: json.garrison.chapter,
          size: json.garrison.size,
        };
        this.setState({
          id: json.id,
          name: json.name,
          inhabitants: json.inhabitants,
          population: json.population,
          garrisonId: json.garrison_id,
          garrison: { ...garrison },
        });
      });
  }

  createGarrisonSelect = () => {
    return this.state.garrisonArray.map((garrison) => {
      return (
        <option key={garrison.id} value={garrison.id}>
          {garrison.chapter}
        </option>
      );
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const configObject = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        inhabitants: this.state.inhabitants,
        population: this.state.population,
        garrison_id: this.state.garrisonId,
      }),
    };

    fetch(PLANET_URL + "/planets/" + this.state.id, configObject)
      .then((resp) => resp.json())
      .then((json) => this.setState({ id: json.id, redirect: true }));
  };

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `/planets/${this.state.id}`,
            state: { message: "Planet Successfully Updated!" },
          }}
        />
      );
    } else {
      return (
        <div id="add-planet-container">
          <h1>Modify Planet</h1>
          <form onSubmit={this.handleSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
            />

            <label>Inhabitants:</label>
            <input
              type="text"
              list="inhabitant-list"
              name="inhabitants"
              onChange={this.handleChange}
              value={this.state.inhabitants}
            />
            <datalist id="inhabitant-list">
              <option>Asharian</option>
              <option>Eldar</option>
              <option>Human</option>
              <option>Ork</option>
            </datalist>

            <label>Population:</label>
            <input
              type="number"
              name="population"
              onChange={this.handleChange}
              value={this.state.population}
              step="1000"
            />

            <label>Garrison:</label>
            <select
              name="garrisonId"
              onChange={this.handleChange}
              value={this.state.garrisonId}
              required
            >
              <option value="" disabled defaultValue hidden>
                Choose from list
              </option>
              {this.createGarrisonSelect()}
            </select>

            <button type="submit">Update</button>
          </form>
        </div>
      );
    }
  }
}
