let lora_field;
let prompt_field;
const replicateProxy = "https://replicate-api-proxy.glitch.me";
let imgs = [];

const myLoraUrl =
  "https://replicate.delivery/pbxt/0KIe8eZNXTuPeIe89ye2U2qRaxClHID7yobYA3cfqiAuV1AeIA/tmptyicwiwqdano_lora_itpzip.safetensors";

function setup() {
  createCanvas(1024, 1024);
  lora_field = createInput(myLoraUrl);
  lora_field.size(550);
  lora_field.position(0, 0);

  prompt_field = createInput(
    "a photo of an astronaut riding a horse in the style of <1>"
  );
  prompt_field.size(550);
  prompt_field.position(0, 20);
  //add a button to ask for words
  let button = createButton("Use Lora");
  button.position(550, 20);
  button.mousePressed(() => {
    askForLora(prompt_field.value(), lora_field.value());
  });
  textSize(18);
}

function draw() {
  background(255);
  if (imgs[0]) image(imgs[0], 0, 0);
  if (imgs[1]) image(imgs[1], 512, 0);
  if (imgs[2]) image(imgs[2], 0, 512);
  if (imgs[3]) image(imgs[3], 512, 512);
}

async function askForLora(prompt, loraUrl) {
  let data = {
    version: "a5b0e981c875f656936c6c67b385c27057e226141e4e62fd5177ce96caee95e2",
    input: {
      prompt: prompt,
      lora_urls: loraUrl,
      //     scheduler: "DPMSolverMultistep",
      lora_scales: "0.5", 
      num_outputs: 4,    
      guidance_scale: 7.5,
      negative_prompt: "hat",
      num_inference_steps: 50,
    },
  };

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const url = replicateProxy + "/create_n_get/";
  console.log("url", url, "options", data);
  const raw = await fetch(url, options);
  const proxy_said = await raw.json();
  console.log(proxy_said);
  let output = proxy_said.output;
  /*
  if (output.length > 0) {
    for (let i = 0; i < output.length; i++) {
      loadImage(output[i], (incomingImage) => {
        imgs[i] = incomingImage;
      });
    }
  }
  */
}
