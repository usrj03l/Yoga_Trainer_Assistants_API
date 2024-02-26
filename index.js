
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import * as readline from 'readline';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// const assistant = await openai.beta.assistants.create({
//     name: "Yoga Teacher",
//     instructions: `You are a yoga expert who teaches yoga to people.
//     You should give solutions using yoga techniques for stress management, mental health, mindfulness,
//     healthy eating, weight loss and quality sleep and other problems that can be solved using yoga.`,
//     model: "gpt-3.5-turbo-0125"

// });

// const assistant = await openai.beta.assistants.retrieve("asst_7cxYoOaBKgrWw7Hov8o9byiJ")

// const thread = await openai.beta.threads.create();

const thread_ID = "thread_bhJt06IGlEp11OoFrNDYseeP";
const assistant_ID = "asst_0BGzb0pvsqmW84F4OXnX2rw3";

// const message = await openai.beta.threads.messages.create(thread_ID, {
//     role: "user",
//     content: "i have stress and anxiety what to do ?"
// })

// const run = await openai.beta.threads.runs.create(thread_ID, {
//     assistant_id: assistant_ID,
//     instructions: "Address the user as Joel"
// })

async function generate(prompt) {
    await openai.beta.threads.messages.create(thread_ID, {
        role: "user",
        content: `${prompt}`
    });

    const run = await openai.beta.threads.runs.create(thread_ID, {
        assistant_id: assistant_ID,
        instructions: "Address the user as Joel"
    });

    while (true) {
        const retrieveRun = await openai.beta.threads.runs.retrieve(thread_ID, run.id);
        if (retrieveRun.status === "completed") {
            const messages = await openai.beta.threads.messages.list(thread_ID);
            console.log(messages.data[0].content[0].text.value);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 4000));
    }
}

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question("Enter prompt: ", prompt => {
    generate(prompt);
    rl.close();
});


