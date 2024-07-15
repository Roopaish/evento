# Description: This file contains the code to get event recommendations based on the event name.
import argparse
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

parser = argparse.ArgumentParser(description='Get event recommendations.')
parser.add_argument('event_name', type=str, help='Name of the event to get recommendations for')
args = parser.parse_args()

# args = argparse.Namespace(event_name='Intuitive national success')

# Function to clean data
def clean_data(x):
    # return str.lower(x.replace(" ", " "))
    return str(x).lower().replace(" ", " ")

# Function to create a combined feature
def create_soup(x):
    return x['id'] + ' ' + x['title'] + ' ' + x['createdById'] + ' ' + x['type'] + ' ' + x['category'] + ' ' + x['address']

# Function to get event recommendations
def get_recommendations(cosine_sim, event_data):
    sim_scores = list(enumerate(cosine_sim[0]))
    # print("sim_scores 1:", sim_scores)
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:9]  # Exclude the event itself
    # print("sim_scores 2:", sim_scores)
    event_indices = [i[0] for i in sim_scores]
    result = event_data['id'].iloc[event_indices].tolist()
    return result

if __name__ == "__main__":

    # Load data
    # event_overall = pd.read_csv('../csv/events.csv').fillna('') # if directly run from this directory
    # if running the script from having this file directory as the entry point, change the directory to where the csv file is located
    event_overall = pd.read_csv('src/server/csv/events.csv').fillna('')
    event_data = event_overall[['id', 'title', 'createdById', 'type', 'category', 'address']]

    # Clean data and create combined feature
    for feature in event_data.columns:
        event_data = event_data.assign(**{feature: event_data[feature].apply(clean_data)})

    # Create combined feature using .apply with axis=1
    soup_df = event_data.apply(lambda row: create_soup(row), axis=1)

    # Create a new DataFrame with the 'soup' column
    event_data = event_data.assign(soup=soup_df)

    # Reset index and create series for easy indexing
    event_data = event_data.reset_index()
    indices = pd.Series(event_data.index, index=event_data['title'])
    title=clean_data(args.event_name)
    if title not in indices:
        print(["No recommendations available for the provided event name."])
        exit(0)
    event_index=indices[title]

    # Create CountVectorizer and calculate cosine similarity
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(event_data['soup'])
    user_count_matrix= count_matrix[event_index]
    cosine_sim2 = cosine_similarity(user_count_matrix, count_matrix)


# Get event recommendations and print
def predict_event():
    return get_recommendations(cosine_sim2, event_data)


# test
print(predict_event())


