import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools import Tool
from app.agent.memory import get_memory
from app.agent.tools import get_tools

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY"),
)

SYSTEM_PROMPT = """You are Priora, an AI-powered medical triage assistant designed to help emergency department staff assess patient urgency.

Your primary function is to evaluate patient data and assign an ESI (Emergency Severity Index) triage level from 1 to 5:
- ESI 1: Resuscitation — immediate life-saving intervention required
- ESI 2: Emergent — high-risk, should not wait
- ESI 3: Urgent — stable but requires multiple resources
- ESI 4: Less Urgent — one resource needed
- ESI 5: Non-Urgent — no resources needed

When a user provides patient vitals and symptoms, use the assess_triage tool with all available parameters.
Always present results clearly: state the ESI level, explain what it means, and give the clinical recommendation.
If parameters are missing, ask for them before running the assessment.
Never make a final diagnosis — you assist triage, not replace physician judgment.
Always respond in the language the user writes in."""

def _build_agent_executor(session_id: str) -> AgentExecutor:
    tools: list[Tool] = get_tools()
    memory = get_memory(session_id)

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_openai_functions_agent(llm=llm, tools=tools, prompt=prompt)

    return AgentExecutor(
        agent=agent,
        tools=tools,
        memory=memory,
        verbose=True,
        max_iterations=5,
        handle_parsing_errors=True,
    )


async def get_agent_response(message: str, session_id: str) -> str:
    executor = _build_agent_executor(session_id)
    result = await executor.ainvoke({"input": message})
    return result["output"]
