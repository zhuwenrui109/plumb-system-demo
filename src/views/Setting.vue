<script setup>
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import GlobalSelect from "@/components/GlobalSelect.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
</script>

<template>
	<div class="setting-wrap">
		<HomeGlobalContent class="setting-content">
			<GlobalContent class="setting-border">
				<SettingTopHandller>
					<template v-slot:right>
						<div class="setting-right">
							<GlobalSelect></GlobalSelect>
							<GlobalSelect></GlobalSelect>
							<GlobalSelect></GlobalSelect>
						</div>
					</template>
				</SettingTopHandller>
				<div class="setting-main">
					<div class="left"></div>
					<div class="right">
						<router-view v-slot="{ Component }">
							<transition name="fade">
								<component :is="Component" />
							</transition>
						</router-view>
					</div>
				</div>
			</GlobalContent>
		</HomeGlobalContent>
	</div>
</template>

<style>
.setting-wrap {
	width: 1890px;
	height: 823px;
	margin: 0 auto;
	box-sizing: border-box;
}

.setting-wrap .setting-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin: 0;
	padding: 12px 0;
}

.setting-wrap .setting-content .setting-border {
	width: 1862px;
	height: 792px;
}
</style>
