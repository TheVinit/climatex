import requests
import json

def fetch_districts():
    url = "https://dicra-api.centralindia.cloudapp.azure.com/api/v2/getdistricts?regionid=3"
    try:
        response = requests.get(url)
        response.raise_for_status()
        districts = response.json()
        print(json.dumps(districts, indent=2))
        with open('maharashtra_districts.json', 'w') as f:
            json.dump(districts, f, indent=2)
        print("\nDistricts saved to maharashtra_districts.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_districts()
