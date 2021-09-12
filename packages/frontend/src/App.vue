<template>
  <div
    class="
      mx-auto
      max-w-2xl
      w-full
      bg-gray-800
      px-4
      py-6
      space-y-4
      rounded-md
      shadow-lg
      border border-gray-700
      my-8
    "
  >
    <div
      class="
        flex flex-col
        items-center
        bg-gray-900
        py-8
        border border-gray-700
        space-y-6
      "
    >
      <svg
        class="w-16 h-16 p-3 bg-gray-700 border border-gray-600 rounded-md"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
          clip-rule="evenodd"
        />
      </svg>
      <div class="space-y-2 flex flex-col items-center">
        <p class="font-bold text-2xl">EmoteZIP</p>
        <p class="text-gray-300 text-sm">
          Downloads emotes from
          <a
            href="https://twitch.tv"
            class="text-primary-400 hover:text-primary-500 transition"
            >Twitch</a
          >
          to a ZIP.
        </p>
      </div>
    </div>
    <div
      class="
        flex
        items-center
        justify-between
        bg-gray-900
        p-6
        border border-gray-700
      "
    >
      <div class="flex items-center space-x-4">
        <div class="space-y-2 text-gray-300 flex-1">
          <p class="text-sm">Username</p>
          <input
            type="text"
            v-model="username"
            class="
              bg-gray-800
              border border-gray-600
              py-1
              px-2
              rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition
              w-32
            "
          />
        </div>
        <div class="space-y-2 text-gray-300 flex-1">
          <p class="text-sm">Size (px)</p>
          <input
            type="text"
            v-model="size"
            class="
              bg-gray-800
              border border-gray-600
              py-1
              px-2
              rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition
              w-32
            "
          />
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div
          class="
            bg-primary-500
            text-white
            p-2
            rounded-full
            hover:bg-primary-600
            transition
            cursor-pointer
            w-8
            h-8
          "
          @click="refresh"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div
          class="
            bg-primary-500
            text-white
            p-2
            rounded-full
            hover:bg-primary-600
            transition
            cursor-pointer
            w-8
            h-8
          "
          @click="download"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="divide-y divide-gray-700 border border-gray-700 bg-gray-900"
      v-for="[id, tier] in Object.entries(tiers)"
      :key="id"
    >
      <div class="flex items-center justify-between px-6 py-4">
        <p class="font-bold text-lg">Tier {{ id }}</p>
        <div class="flex space-x-3">
          <div
            class="
              w-6
              h-6
              bg-gray-700
              p-1
              rounded-full
              border border-gray-600
              cursor-pointer
              hover:bg-gray-600 hover:border-gray-500
              transition
            "
            @click="toggleTier(id, false)"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div
            class="
              w-6
              h-6
              bg-gray-700
              p-1
              rounded-full
              border border-gray-600
              cursor-pointer
              hover:bg-gray-600 hover:border-gray-500
              transition
            "
            @click="toggleTier(id, true)"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        v-for="emote in tier"
        :key="emote.id"
        class="px-6 py-4 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <img :src="emote.url" class="w-8 h-8" />
          <div>
            <p class="font-bold">{{ emote.name }}</p>
            <p class="text-gray-400 text-sm">{{ emote.id }}</p>
          </div>
        </div>
        <div
          :class="[
            'rounded-md border transition duration-100',
            { 'bg-gray-900 text-gray-900 border-gray-700': !emote.selected },
            {
              'bg-primary-500 text-white border-primary-600': emote.selected,
            },
          ]"
          @click="emote.selected = !emote.selected"
        >
          <svg class="w-6 h-6 p-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="
        flex
        items-center
        justify-center
        bg-gray-900
        py-6
        border border-gray-700
        text-sm text-gray-300
        divide-x divide-gray-400
      "
    >
      <p class="px-3">
        Built by
        <a
          href="https://atriplex.co"
          class="text-primary-400 hover:text-primary-500 transition"
          >Atriplex</a
        >
      </p>
      <a
        href="https://github.com/asineth0/emotezip"
        class="px-3 text-primary-400 hover:text-primary-500 transition"
        >Code</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

interface Tier {
  id: string;
  name: string;
  url: string;
  selected: boolean;
}

const username = ref("sleepy");
const size = ref("48");
const tiers = ref({} as Record<string, Tier[]>);

const refresh = async () => {
  tiers.value = {};

  const emotes = (
    await axios.post(`/api/list`, {
      username: username.value,
    })
  ).data;

  for (const emote of emotes) {
    if (!tiers.value[emote.tier]) {
      tiers.value[emote.tier] = [];
    }

    tiers.value[emote.tier].push({
      ...emote,
      selected: true,
    });
  }
};

const toggleTier = (id: string, val: boolean) => {
  tiers.value[id].map((e: any) => {
    e.selected = val;
  });
};

const download = async () => {
  const list = [];

  for (const tier of Object.values(tiers.value) as Array<any>) {
    for (const emote of tier) {
      if (emote.selected) {
        list.push({
          id: emote.id,
          name: emote.name,
        });
      }
    }
  }

  const { data } = await axios.post(
    "/api/zip",
    {
      list,
      size: +size.value,
    },
    {
      responseType: "blob",
    }
  );

  const url = URL.createObjectURL(data);
  const el = document.createElement("a");
  el.download = `${username.value}.zip`;
  el.href = url;
  el.click();
  URL.revokeObjectURL(url); // free up mem on next GC.
};
</script>

<style>
@import url("./assets/fonts/inter-v2-latin.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-900 text-white;
}

::-webkit-scrollbar {
  @apply w-3;
}

::-webkit-scrollbar-thumb {
  @apply bg-white bg-opacity-5 rounded-full;
}
</style>
