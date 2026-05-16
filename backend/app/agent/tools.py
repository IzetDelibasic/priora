from langchain.tools import Tool
from datetime import datetime


def get_current_datetime(_: str = "") -> str:
    return datetime.now().strftime("%d.%m.%Y %H:%M:%S")


def calculate(expression: str) -> str:
    try:
        allowed = set("0123456789+-*/()., ")
        if not all(c in allowed for c in expression):
            return "Error: Expression contains invalid characters."
        result = eval(expression)  # noqa: S307
        return str(result)
    except Exception as e:
        return f"Calculation error: {str(e)}"


def get_tools() -> list[Tool]:
    return [
        Tool(
            name="get_datetime",
            func=get_current_datetime,
            description="Use when the user asks for the current date or time.",
        ),
        Tool(
            name="calculator",
            func=calculate,
            description="Use for mathematical calculations. Input is a math expression.",
        ),
    ]
