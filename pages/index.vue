<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <hr class="my-2 border" />
    <div class="grid grid-cols-12 gap-2">
<!--        <div class="flex relative rounded-full hover:bg-gradient-to-br from-[#68DE1F] to-[#0FC6DB] p-px">-->
<!--          <div class="block w-full md:min-w-[20em] rounded-full border border-transparent bg-gray-50 hover:border-transparent " >jjhkhjk</div>-->
<!--        </div>-->

      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <div
          class="p-2 rounded-lg bg-white shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 font-medium">Today's Money</div>
            <div class="text-gray-700 font-bold text-lg">
              $53,000
              <span class="text-sm text-yellow-600">+55%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <div
          class="p-2 rounded-lg bg-white shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 font-medium">Today's Users</div>
            <div class="text-gray-700 font-bold text-lg">
              2,300
              <span class="text-sm text-yellow-600">+3%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >

          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <div
          class="p-2 rounded-lg bg-white shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 font-medium">New Clients</div>
            <div class="text-gray-700 font-bold text-lg">
              +3,462
              <span class="text-sm text-red-600">+2%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >

          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 lg:col-span-4">
        <div
          class="p-2 rounded-lg bg-white shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 font-medium">Sales</div>
            <div class="text-gray-700 font-bold text-lg">
              $103,430
              <span class="text-sm text-yellow-600">+5%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >

          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 mt-2">
      <div class="col-span-12 lg:col-span-7">
        <div class="flex gap-2 rounded-lg p-4 shadow bg-white">
          <div class="flex flex-col justify-between">
            <div class="">
              <div class="text-gray-500 font-medium">Built by developers</div>
              <div class="text-gray-700 font-bold text-xl">
                CI2 Dashboard
              </div>
              <div class="">
                From colors, cards, typography to complex elements, you will
                find the full documentation.
              </div>
            </div>
            <div class="">Read More ...</div>
          </div>
          <div
            class="rounded-lg bg-gradient-to-tl from-gray-50 to-gray-200 flex items-center justify-center w-52 h-52"
          >

          </div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-5">
        <div class="flex gap-2 bg-white rounded-lg p-4 shadow">
          <div class="flex flex-col justify-between">
            <div class="">
              <div class="text-gray-500 font-medium">Built by developers</div>
              <div class="text-gray-700 font-bold text-xl">
                CI2 Atmosphere Dashboard
              </div>
              <div class="">
                From colors, cards, typography to complex elements, you will
                find the full documentation.
              </div>
            </div>
            <div class="">Read More ...</div>
          </div>
          <div
            class="rounded-lg bg-gradient-to-tl from-gray-50 to-gray-200 flex items-center justify-center w-52 h-52"
          >

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

useHead({
  title: "Dashboard",
});

</script>
