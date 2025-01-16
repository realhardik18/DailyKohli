import pandas as pd

def year():
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    days_in_month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]  # Include 29 days for February

    # Generate the dictionary
    days_of_year = {}
    for month, days in zip(months, days_in_month):
        for day in range(1, days + 1):
            days_of_year[f"{day} {month}"] = None

    return days_of_year

data=pd.read_csv('match_data.csv')
Year=year()
for date in data['Date']:
    date=date.split(' ')
    print(date)
            