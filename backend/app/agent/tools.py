from langchain.tools import Tool
from datetime import datetime


def get_current_datetime(_: str = "") -> str:
    return datetime.now().strftime("%d.%m.%Y %H:%M:%S")


def calculate(expression: str) -> str:
    try:
        allowed = set("0123456789+-*/()., ")
        if not all(c in allowed for c in expression):
            return "Greška: Izraz sadrži nedozvoljene karaktere."
        result = eval(expression)  # noqa: S307
        return str(result)
    except Exception as e:
        return f"Greška u izračunu: {str(e)}"


def get_tools() -> list[Tool]:
    return [
        Tool(
            name="get_datetime",
            func=get_current_datetime,
            description="Koristiti kada korisnik pita za trenutni datum ili vrijeme.",
        ),
        Tool(
            name="calculator",
            func=calculate,
            description="Koristiti za matematičke izračune. Input je matematički izraz.",
        ),
    ]
