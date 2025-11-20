import { NumberInput, Button, Icon, CollapsibleSection, ColorInput, Logo } from '@mtrifonov-design/pinsandcurves-design';
import React, { useEffect, useState, useSyncExternalStore } from 'react';
import hexToRgb, { rgbToHex } from './hexToRgb';
import LissajousSelectButtonGroup from './LissajousPreview';
import { LISSAJOUS_CURVES, LISSAJOUS_CURVES_MAX_INTEGRAL } from './lissajousCurves';
import PresetButton from './PresetButton';
import presets from './presets';
import SwitchableSection from './SwitchableSection';
import useStore from '../../store/useStore';
import { Instagram, Youtube, GitHub, Globe } from 'react-feather';
import styles from './styles.module.css';

export default function Component() {
  const state = useStore(store => store);
  const update = useStore(store => store.updateStore);

  const updateColor = (idx: number, value: [number, number, number]) => {
    const colors = state.particleColors.slice();
    colors[idx] = value as [number, number, number];
    update({ particleColors: colors });
  };

  const addColor = () => update({ particleColors: [...state.particleColors, [255, 255, 255]] });

  const removeColor = (idx: number) => {
    if (state.particleColors.length === 1) return;
    update({ particleColors: state.particleColors.filter((_, i) => i !== idx) });
  };

  const setPreset = (preset: typeof presets[keyof typeof presets]) => {
    update({
      ...preset,
      particleColors: preset.particleColors.map(c => [c[0] / 255, c[1] / 255, c[2] / 255])
    });
  }


  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
        backgroundColor: "var(--gray1)",
        width: '100%',
        height: '100vh',
        padding: '3rem',
        paddingTop: '2rem',
        color: 'var(--gray6)',
        overflow: 'scroll',
        scrollbarColor: 'var(--gray3) var(--gray1)',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--gray2)',
      }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '0.3rem',

      }}>
        <Logo style={{
          width: '2rem',
          height: '2rem',
          marginBottom: '0.2rem',
        }}
          color="var(--gray4)"
        />
      <span style={{
        color: 'var(--gray4)',
        fontWeight: "bold",
        fontSize: "1.2rem",
      }}>
        Pins and Curves
      </span>

      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <a href="https://www.instagram.com/pinsandcurves/"
          target="_blank"
        ><Instagram size={24} className={styles.hoverLink} /></a>
        <a href="https://www.youtube.com/@pinsandcurves"
          target="_blank"
        ><Youtube size={24} className={styles.hoverLink} /></a>
        <a href="https://github.com/mtrifonov-design/pinsandcurves-liquidlissajous"
          target="_blank"
        ><GitHub size={24} className={styles.hoverLink} /></a>
        <a href="https://pinsandcurves.app"
          target="_blank"
        ><Globe size={24} className={styles.hoverLink} /></a>
      </div>
      </div>
      <span style={{
        color: 'var(--gray7)',
        fontWeight: "bold",
        fontSize: "2em",
      }}>
        Liquid Lissajous
      </span>

      Pick a preset to get started
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <PresetButton
          label="Burning Sunset"
          preset={presets.burningSunset}
          onClick={setPreset}
        />
        <PresetButton
          label="Ocean Blues"
          preset={presets.oceanBlues}
          onClick={setPreset}
        />
        <PresetButton
          label="Forest Greens"
          preset={presets.forestGreens}
          onClick={setPreset}
        />
        <PresetButton
          label="Hot Pink"
          preset={presets.hotPink}
          onClick={setPreset}
        />
        <PresetButton
          label="Tropical Disco"
          preset={presets.tropicalDisco}
          onClick={setPreset}
        />
      </div>
      Customize to your liking
      <CollapsibleSection title="General" iconName="settings">

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'space-between',
        }}>
          canvas size &nbsp;
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <NumberInput
              initialValue={state.width}
              min={100}
              max={1920 * 2}
              step={10}
              onCommit={c => update({ width: c })}
            />
            <span>x</span>

            <NumberInput
              initialValue={state.height}
              min={100}
              max={1080 * 2}
              step={10}
              onCommit={c => update({ height: c })}
            />
          </div>
        </label>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'space-between',
        }}>
          animation speed &nbsp;
          <NumberInput
            initialValue={state.animationSpeed}
            min={1}
            max={5}
            step={1.5}
            onChange={c => {
              update({ animationSpeed: c })
            }}
          />
        </label>
        <SwitchableSection label="export perfect loop"
          activeOnToggled={false}
          checked={state.exportPerfectLoop}
          onToggle={(checked: boolean) => update({ exportPerfectLoop: checked })}
        >
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'space-between',
          }}>
            export duration (seconds) &nbsp;
            <NumberInput
              initialValue={state.exportDuration}
              min={1}
              max={30}
              step={1}
              onCommit={(c) => {
                update({ exportDuration: c })
              }}
            />
          </label>
        </SwitchableSection>
      </CollapsibleSection>
      <CollapsibleSection title="Colors" iconName="palette">
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          justifyContent: 'space-between',
        }}>
          mixing softness &nbsp;
          <NumberInput
            initialValue={state.mixingIntensity}
            min={0}
            max={1}
            step={0.01}
            onChange={c => update({ mixingIntensity: c })}
          />
        </label>
        <fieldset
          style={{
            borderColor: 'var(--gray4)',
            borderRadius: 'var(--borderRadiusSmall)',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignContent: 'center',
          }}
        >
          <legend>particle colours</legend>
          {state.particleColors.map((_, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              justifyContent: 'center',
              borderRadius: "var(--borderRadiusSmall)",
              border: "1px solid var(--gray3)",
              padding: "0.0rem 0.5rem",
            }}>
              {/* <input
              type="color"
              value={rgbToHex(state.particleColors[i])}
              onChange={e => updateColor(i, e.target.value)}
              style={{
                border: "none",
                backgroundColor: "var(--gray3)",
                borderRadius: "var(--borderRadiusSmall)",
                width: "35px",
                height: "35px",
              }}
            /> */}
              <ColorInput
                colorMode="rgb"
                color={{ r: state.particleColors[i][0], g: state.particleColors[i][1], b: state.particleColors[i][2] }}
                onChange={color => updateColor(i, [color.r, color.g, color.b])}
              />
              <Icon iconName={"delete"} onClick={() => removeColor(i)} />
            </div>
          ))}
          <Button text={"+ add colour"} onClick={addColor} />
        </fieldset>
      </CollapsibleSection>
      <CollapsibleSection title="Lissajous Knot" iconName="all_inclusive">
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          padding: "1.5rem",
          borderWidth: "2px",
          backgroundColor: "var(--gray2)",
          borderRadius: "var(--borderRadiusSmall)",
          marginBottom: "1rem",
          alignItems: "center",
        }}>
          <div>
            <Icon iconName="info" hoverBgColor='var(--gray2)' color="white" />
          </div>
          <div>
            <b style={{ color: "white" }}>What are Lissajous knots?</b><br></br>
            Lissajous knots are mathematical paths that are defined by equations involving sine and cosine functions.
            They are used here to create complex, looping paths on which color particles can move.
            Feel free to experiment with different parameters to create unique patterns.
          </div>
        </div>
        <div style={{
        }}>
          <SwitchableSection label="display lissajous knot"
            checked={(state.showLissajousFigure)}
            onToggle={(checked: boolean) => update({ showLissajousFigure: checked })}
          >
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <LissajousSelectButtonGroup
                value={state.lissajousParams}
                options={LISSAJOUS_CURVES.map(curve => ({
                  label: `${curve.params.a}:${curve.params.b}`,
                  value: curve.params,
                  integral: curve.integral,
                }))}
                onChange={(params, integral) => {
                  update({
                    lissajousParams: params,
                    lissajousIntegral: integral,
                  });
                }}

              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'space-between',
              }}>
                horizontal rotation &nbsp;
                <NumberInput
                  initialValue={state.rotateHorizontal}
                  min={0}
                  max={360}
                  step={1}
                  onChange={c => {
                    update({ rotateHorizontal: c })
                  }}
                />
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'space-between',
              }}>
                vertical rotation &nbsp;
                <NumberInput
                  initialValue={state.rotateVertical}
                  min={0}
                  max={360}
                  step={1}
                  onChange={c => {
                    update({ rotateVertical: c })
                  }}
                />
              </label>
            </div>
          </SwitchableSection>
        </div>


      </CollapsibleSection>
      <CollapsibleSection title="Effects" iconName="star">
        <>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'space-between',
          }}>
            noise intensity &nbsp;
            <NumberInput
              initialValue={state.noiseIntensity}
              min={0}
              max={1}
              step={0.01}
              onChange={c => {
                update({ noiseIntensity: c })
              }}
            />
          </label>
        </>
      </CollapsibleSection>
    </div>
  );
}
