import { ElevenLabsClient, play } from "elevenlabs";
import * as fs from 'fs';

async function main() {
    const apiKey = "YOUR_API_KEY";
    const voiceId = "Rachel's Voice ID";
    const filePath = "/path/to/your/dictionary.pls";
    const elevenlabs = new ElevenLabsClient({ apiKey });

    // Step 1: Create a Pronunciation Dictionary from a File
    const pronunciationDictionary = await elevenlabs.pronunciationDictionary.createFromFile(
        fs.createReadStream(filePath),
        { name: "CustomDictionary" }
    );

    // Step 2: Generate Speech with Custom Pronunciation Dictionary
    let audioStream = await elevenlabs.textToSpeech.convert(
        voiceId,
        {
            text: "Tomato",
            model_id: "eleven_multilingual_v2",
            pronunciation_dictionary_locators: [{ pronunciation_dictionary_id: pronunciationDictionary.id, version_id: pronunciationDictionary.version_id }]
        }
    );
    console.log("Playing sound with custom pronunciation...");
    await play(audioStream);

    // Step 3: Remove a Rule from the Pronunciation Dictionary
    await elevenlabs.pronunciationDictionary.removeRulesFromThePronunciationDictionary(
        pronunciationDictionary.id,
        {
            rule_strings: ["tomato"]
        }
    );

    // Step 4: Generate Speech Again (Without Custom Rule)
    audioStream = await elevenlabs.textToSpeech.convert(
        voiceId,
        {
            text: "Tomato",
            model_id: "eleven_multilingual_v2",
            pronunciation_dictionary_locators: [{ pronunciation_dictionary_id: pronunciationDictionary.id, version_id: pronunciationDictionary.version_id }]
        }
    );
    console.log("Playing sound without custom rule...");
    await play(audioStream);

    // Step 5: Add Rules to the Pronunciation Dictionary
    await elevenlabs.pronunciationDictionary.addRulesToThePronunciationDictionary(
        pronunciationDictionary.id,
        {
            rules: [
                { type: "alias", string_to_replace: "tomato", alias: "tuh-may-toe" }
            ]
        }
    );

    // Step 6: Generate Speech Again (With New Rule)
    audioStream = await elevenlabs.textToSpeech.convert(
        voiceId,
        {
            text: "Tomato",
            model_id: "eleven_multilingual_v2",
            pronunciation_dictionary_locators: [{ pronunciation_dictionary_id: pronunciationDictionary.id, version_id: pronunciationDictionary.version_id }]
        }
    );
    console.log("Playing sound with new rule...");
    await play(audioStream);
}

main().catch(console.error);
