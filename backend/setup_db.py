import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    conn = psycopg2.connect(user='postgres', password='password', host='localhost', port='5432')
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    try:
        cur.execute("CREATE ROLE bookforge_user WITH LOGIN PASSWORD 'bookforge_password';")
        print("Role created.")
    except Exception as e:
        print("Role might already exist:", e)
        
    try:
        cur.execute("CREATE DATABASE bookforge OWNER bookforge_user;")
        print("Database created.")
    except Exception as e:
        print("Database might already exist:", e)
        
    cur.close()
    conn.close()
except Exception as e:
    print("Could not connect to postgres:", e)
