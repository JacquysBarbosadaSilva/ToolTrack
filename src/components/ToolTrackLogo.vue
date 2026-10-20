<template>
  <div class="tooltrack-brand">
    <div class="logo-box-wrapper" :style="{ maxWidth: `${size}px` }">
      <svg
        viewBox="0 0 240 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >

        <g class="disc-group">

          <circle
            cx="120"
            cy="70"
            r="38"
            fill="#ffffff"
            stroke="#121633"
            stroke-width="5"
          />

          <circle
            cx="120"
            cy="70"
            r="12"
            fill="#121633"
          />
          <circle
            cx="120"
            cy="70"
            r="6"
            fill="#ffffff"
          />
        </g>

        <polygon
          points="88,68 100,32 142,32 152,68"
          fill="#ffffff"
          stroke="#121633"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <polygon
          points="62,82 28,68 62,50 96,65"
          fill="#ffffff"
          stroke="#121633"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <polygon
          points="144,65 178,50 212,68 178,82"
          fill="#ffffff"
          stroke="#121633"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <polygon
          points="62,82 120,108 120,172 62,138"
          fill="#ffffff"
          stroke="#121633"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <polygon
          points="120,108 178,82 178,138 120,172"
          fill="#ffffff"
          stroke="#121633"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <g transform="matrix(0.92, -0.38, 0, 1.05, 134, 150)">
          <text
            x="0"
            y="0"
            font-family="'Playfair Display', Georgia, serif"
            font-size="46"
            font-weight="900"
            fill="#121633"
            text-anchor="middle"
          >
            T
          </text>
        </g>
      </svg>
    </div>

    <h1 v-if="showText" class="brand-name">
      ToolTrack
    </h1>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 190
  },
  showText: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.tooltrack-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.logo-box-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
}

.logo-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.brand-name {
  margin: 12px 0 0 0;
  color: #ffffff;
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-size: 2.35rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;
}
</style>
